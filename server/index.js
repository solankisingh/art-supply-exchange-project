import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readData, writeData, files } from './db.js';
import { authMiddleware, optionalAuth, adminMiddleware, JWT_SECRET } from './auth.js';
import { seedDatabase } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auto seed on startup
seedDatabase();

// ---------------- AUTH ROUTES ----------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, location, bio } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const users = readData(files.USERS_FILE, []);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      role: 'user',
      location: location || 'Seattle, WA',
      bio: bio || 'Art enthusiast and creative community member.',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData(files.USERS_FILE, users);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = newUser;
    res.status(201).json({ user: userWithoutPass, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readData(files.USERS_FILE, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const users = readData(files.USERS_FILE, []);
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User profile not found.' });
  }
  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass });
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, (req, res) => {
  const { name, location, bio, avatar } = req.body;
  const users = readData(files.USERS_FILE, []);
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (name) users[idx].name = name;
  if (location) users[idx].location = location;
  if (bio) users[idx].bio = bio;
  if (avatar) users[idx].avatar = avatar;

  writeData(files.USERS_FILE, users);
  const { password: _, ...userWithoutPass } = users[idx];
  res.json({ user: userWithoutPass });
});

// ---------------- MARKETPLACE & ITEM ROUTES ----------------
app.get('/api/items', (req, res) => {
  try {
    const { search, category, condition, location, sort, minPrice, maxPrice } = req.query;
    let items = readData(files.ITEMS_FILE, []);
    const users = readData(files.USERS_FILE, []);

    // Filter by search query
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(it => 
        it.title.toLowerCase().includes(q) || 
        it.description.toLowerCase().includes(q) ||
        (it.swapPreferences && it.swapPreferences.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (category && category !== 'All') {
      items = items.filter(it => it.category === category);
    }

    // Filter by Condition
    if (condition && condition !== 'All') {
      items = items.filter(it => it.condition === condition);
    }

    // Filter by Location
    if (location && location !== 'All') {
      items = items.filter(it => it.location.toLowerCase().includes(location.toLowerCase()));
    }

    // Filter by Price range
    if (minPrice) {
      items = items.filter(it => it.price >= Number(minPrice));
    }
    if (maxPrice) {
      items = items.filter(it => it.price <= Number(maxPrice));
    }

    // Sort
    if (sort === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else {
      // Default: newest first
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Hydrate with seller summary
    const populated = items.map(item => {
      const seller = users.find(u => u.id === item.sellerId);
      return {
        ...item,
        seller: seller ? { id: seller.id, name: seller.name, avatar: seller.avatar, location: seller.location } : null
      };
    });

    res.json(populated);
  } catch (err) {
    console.error('Fetch items error:', err);
    res.status(500).json({ message: 'Error retrieving items.' });
  }
});

app.get('/api/items/:id', (req, res) => {
  const items = readData(files.ITEMS_FILE, []);
  const users = readData(files.USERS_FILE, []);
  const item = items.find(it => it.id === req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Art supply listing not found.' });
  }

  const seller = users.find(u => u.id === item.sellerId);
  res.json({
    ...item,
    seller: seller ? { id: seller.id, name: seller.name, avatar: seller.avatar, bio: seller.bio, location: seller.location } : null
  });
});

app.post('/api/items', authMiddleware, (req, res) => {
  try {
    const { title, description, category, condition, price, isSwapAvailable, swapPreferences, location, images } = req.body;
    if (!title || !description || !category || !condition) {
      return res.status(400).json({ message: 'Please provide all required product details.' });
    }

    const items = readData(files.ITEMS_FILE, []);
    const defaultImages = [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
    ];

    const newItem = {
      id: `item_${Date.now()}`,
      sellerId: req.user.id,
      title,
      description,
      category,
      condition,
      price: Number(price) || 0,
      isSwapAvailable: Boolean(isSwapAvailable),
      swapPreferences: swapPreferences || '',
      location: location || req.user.location || 'Local Artist Community',
      status: 'available',
      images: (images && images.length > 0) ? images : defaultImages,
      createdAt: new Date().toISOString()
    };

    items.unshift(newItem);
    writeData(files.ITEMS_FILE, items);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: 'Error creating product listing.' });
  }
});

app.put('/api/items/:id', authMiddleware, (req, res) => {
  const items = readData(files.ITEMS_FILE, []);
  const idx = items.findIndex(it => it.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  if (items[idx].sellerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized to modify this listing.' });
  }

  const allowedUpdates = ['title', 'description', 'category', 'condition', 'price', 'isSwapAvailable', 'swapPreferences', 'status', 'location', 'images'];
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      items[idx][field] = req.body[field];
    }
  });

  writeData(files.ITEMS_FILE, items);
  res.json(items[idx]);
});

app.delete('/api/items/:id', authMiddleware, (req, res) => {
  let items = readData(files.ITEMS_FILE, []);
  const item = items.find(it => it.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  if (item.sellerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized to delete this listing.' });
  }

  items = items.filter(it => it.id !== req.params.id);
  writeData(files.ITEMS_FILE, items);
  res.json({ message: 'Listing successfully removed.' });
});

// ---------------- SWAP REQUEST ROUTES ----------------
app.get('/api/swaps', authMiddleware, (req, res) => {
  const swaps = readData(files.SWAPS_FILE, []);
  const items = readData(files.ITEMS_FILE, []);
  const users = readData(files.USERS_FILE, []);

  // Filter swaps where user is either requester or seller
  const userSwaps = swaps.filter(s => s.requesterId === req.user.id || s.sellerId === req.user.id);

  const populated = userSwaps.map(swap => {
    const targetItem = items.find(i => i.id === swap.targetItemId);
    const offeredItem = items.find(i => i.id === swap.offeredItemId);
    const requester = users.find(u => u.id === swap.requesterId);
    const seller = users.find(u => u.id === swap.sellerId);

    return {
      ...swap,
      targetItem,
      offeredItem,
      requester: requester ? { id: requester.id, name: requester.name, avatar: requester.avatar } : null,
      seller: seller ? { id: seller.id, name: seller.name, avatar: seller.avatar } : null,
      isIncoming: swap.sellerId === req.user.id
    };
  });

  // Sort newest first
  populated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(populated);
});

app.post('/api/swaps', authMiddleware, (req, res) => {
  try {
    const { targetItemId, offeredItemId, offeredDescription } = req.body;
    if (!targetItemId || (!offeredItemId && !offeredDescription)) {
      return res.status(400).json({ message: 'Please specify the target item and your offer details.' });
    }

    const items = readData(files.ITEMS_FILE, []);
    const targetItem = items.find(i => i.id === targetItemId);
    if (!targetItem) {
      return res.status(404).json({ message: 'Target item not found.' });
    }

    if (targetItem.sellerId === req.user.id) {
      return res.status(400).json({ message: 'You cannot initiate a swap request for your own listing.' });
    }

    const swaps = readData(files.SWAPS_FILE, []);
    const newSwap = {
      id: `swap_${Date.now()}`,
      requesterId: req.user.id,
      sellerId: targetItem.sellerId,
      targetItemId,
      offeredItemId: offeredItemId || null,
      offeredDescription: offeredDescription || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    swaps.unshift(newSwap);
    writeData(files.SWAPS_FILE, swaps);

    // Also auto-create a message thread in chat for this swap negotiation
    const messages = readData(files.MESSAGES_FILE, []);
    let conv = messages.find(c => 
      c.itemId === targetItemId && 
      c.participants.includes(req.user.id) && 
      c.participants.includes(targetItem.sellerId)
    );

    const initialText = `[SWAP PROPOSAL]: I would like to swap with you for "${targetItem.title}". ${offeredDescription || 'Please review my offered item.'}`;

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        participants: [req.user.id, targetItem.sellerId],
        itemId: targetItemId,
        itemTitle: targetItem.title,
        messages: [{
          id: `msg_${Date.now()}`,
          senderId: req.user.id,
          text: initialText,
          timestamp: new Date().toISOString()
        }],
        updatedAt: new Date().toISOString()
      };
      messages.unshift(conv);
    } else {
      conv.messages.push({
        id: `msg_${Date.now()}`,
        senderId: req.user.id,
        text: initialText,
        timestamp: new Date().toISOString()
      });
      conv.updatedAt = new Date().toISOString();
    }
    writeData(files.MESSAGES_FILE, messages);

    res.status(201).json(newSwap);
  } catch (err) {
    console.error('Create swap error:', err);
    res.status(500).json({ message: 'Error submitting swap offer.' });
  }
});

app.put('/api/swaps/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body; // 'accepted', 'rejected', 'completed', 'cancelled'
  const swaps = readData(files.SWAPS_FILE, []);
  const idx = swaps.findIndex(s => s.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ message: 'Swap request not found.' });
  }

  const swap = swaps[idx];
  // Only seller can accept/reject; requester can cancel; either can complete
  if (swap.sellerId !== req.user.id && swap.requesterId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized.' });
  }

  swaps[idx].status = status;
  writeData(files.SWAPS_FILE, swaps);

  // If accepted or completed, update item status
  if (status === 'completed') {
    const items = readData(files.ITEMS_FILE, []);
    const targetIdx = items.findIndex(i => i.id === swap.targetItemId);
    if (targetIdx !== -1) {
      items[targetIdx].status = 'swapped';
    }
    if (swap.offeredItemId) {
      const offeredIdx = items.findIndex(i => i.id === swap.offeredItemId);
      if (offeredIdx !== -1) {
        items[offeredIdx].status = 'swapped';
      }
    }
    writeData(files.ITEMS_FILE, items);
  }

  res.json(swaps[idx]);
});

// ---------------- CHAT & MESSAGING ROUTES ----------------
app.get('/api/conversations', authMiddleware, (req, res) => {
  const messages = readData(files.MESSAGES_FILE, []);
  const users = readData(files.USERS_FILE, []);
  const items = readData(files.ITEMS_FILE, []);

  const userConversations = messages.filter(c => c.participants.includes(req.user.id));

  const enriched = userConversations.map(conv => {
    const otherParticipantId = conv.participants.find(p => p !== req.user.id) || req.user.id;
    const otherUser = users.find(u => u.id === otherParticipantId);
    const item = items.find(i => i.id === conv.itemId);

    return {
      id: conv.id,
      itemId: conv.itemId,
      item: item ? { id: item.id, title: item.title, price: item.price, image: item.images[0] } : null,
      otherUser: otherUser ? { id: otherUser.id, name: otherUser.name, avatar: otherUser.avatar } : { name: 'Art Community Member' },
      lastMessage: conv.messages[conv.messages.length - 1],
      updatedAt: conv.updatedAt
    };
  });

  enriched.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json(enriched);
});

app.get('/api/conversations/:id', authMiddleware, (req, res) => {
  const messages = readData(files.MESSAGES_FILE, []);
  const users = readData(files.USERS_FILE, []);
  const items = readData(files.ITEMS_FILE, []);

  const conv = messages.find(c => c.id === req.params.id);
  if (!conv || !conv.participants.includes(req.user.id)) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }

  const otherParticipantId = conv.participants.find(p => p !== req.user.id) || req.user.id;
  const otherUser = users.find(u => u.id === otherParticipantId);
  const item = items.find(i => i.id === conv.itemId);

  res.json({
    ...conv,
    otherUser: otherUser ? { id: otherUser.id, name: otherUser.name, avatar: otherUser.avatar, location: otherUser.location } : null,
    item
  });
});

app.post('/api/conversations', authMiddleware, (req, res) => {
  try {
    const { sellerId, itemId, initialMessage } = req.body;
    if (!sellerId || !itemId) {
      return res.status(400).json({ message: 'Seller ID and Item ID are required.' });
    }

    const messages = readData(files.MESSAGES_FILE, []);
    const items = readData(files.ITEMS_FILE, []);
    const item = items.find(i => i.id === itemId);

    let conv = messages.find(c => 
      c.itemId === itemId && 
      c.participants.includes(req.user.id) && 
      c.participants.includes(sellerId)
    );

    const now = new Date().toISOString();

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        participants: [req.user.id, sellerId],
        itemId,
        itemTitle: item ? item.title : 'Art Supply Item',
        messages: initialMessage ? [{
          id: `msg_${Date.now()}`,
          senderId: req.user.id,
          text: initialMessage,
          timestamp: now
        }] : [],
        updatedAt: now
      };
      messages.unshift(conv);
    } else if (initialMessage) {
      conv.messages.push({
        id: `msg_${Date.now()}`,
        senderId: req.user.id,
        text: initialMessage,
        timestamp: now
      });
      conv.updatedAt = now;
    }

    writeData(files.MESSAGES_FILE, messages);
    res.status(201).json(conv);
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ message: 'Error initiating conversation.' });
  }
});

app.post('/api/conversations/:id/messages', authMiddleware, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Message text cannot be empty.' });
  }

  const messages = readData(files.MESSAGES_FILE, []);
  const conv = messages.find(c => c.id === req.params.id);
  if (!conv || !conv.participants.includes(req.user.id)) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }

  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: req.user.id,
    text: text.trim(),
    timestamp: new Date().toISOString()
  };

  conv.messages.push(newMsg);
  conv.updatedAt = new Date().toISOString();
  writeData(files.MESSAGES_FILE, messages);

  res.status(201).json(newMsg);
});

// ---------------- ADMIN MODULE ROUTES ----------------
app.get('/api/admin/overview', authMiddleware, adminMiddleware, (req, res) => {
  const users = readData(files.USERS_FILE, []);
  const items = readData(files.ITEMS_FILE, []);
  const swaps = readData(files.SWAPS_FILE, []);
  const messages = readData(files.MESSAGES_FILE, []);

  const stats = {
    totalUsers: users.length,
    totalItems: items.length,
    activeListings: items.filter(i => i.status === 'available').length,
    totalSwaps: swaps.length,
    completedSwaps: swaps.filter(s => s.status === 'completed').length,
    totalMessages: messages.reduce((acc, c) => acc + c.messages.length, 0)
  };

  const safeUsers = users.map(({ password, ...u }) => u);

  res.json({
    stats,
    users: safeUsers,
    items,
    swaps
  });
});

app.patch('/api/admin/users/:id/role', authMiddleware, adminMiddleware, (req, res) => {
  const { role } = req.body;
  const users = readData(files.USERS_FILE, []);
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  users[idx].role = role;
  writeData(files.USERS_FILE, users);
  const { password: _, ...userWithoutPass } = users[idx];
  res.json(userWithoutPass);
});

// ---------------- STATIC SERVING (FOR DEPLOYMENT / PRODUCTION) ----------------
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.get('{*path}', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Art Supply Marketplace Server running on port ${PORT}`);
});
