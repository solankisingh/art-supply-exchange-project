import bcrypt from 'bcryptjs';
import { readData, writeData, files } from './db.js';

export const seedDatabase = async () => {
  const users = readData(files.USERS_FILE, []);
  
  if (users.length > 0) {
    console.log('Database already populated. Skipping re-seed.');
    return;
  }

  console.log('Seeding initial realistic art marketplace data...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const initialUsers = [
    {
      id: 'usr_admin',
      name: 'Elena Rostova (Admin)',
      email: 'admin@artexchange.org',
      password: passwordHash,
      role: 'admin',
      location: 'Downtown Art District, Seattle',
      bio: 'Platform moderator, curator, and fine arts educator.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      createdAt: '2026-01-10T10:00:00.000Z'
    },
    {
      id: 'usr_sarah',
      name: 'Sarah Jenkins',
      email: 'sarah@studioart.com',
      password: passwordHash,
      role: 'user',
      location: 'Capitol Hill, Seattle',
      bio: 'BFA student specializing in oil painting and botanical illustration. Always hunting for vintage sable brushes.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      createdAt: '2026-02-01T12:00:00.000Z'
    },
    {
      id: 'usr_marcus',
      name: 'Marcus Chen',
      email: 'marcus@pleinair.org',
      password: passwordHash,
      role: 'user',
      location: 'Fremont, Seattle',
      bio: 'Plein air watercolorist and printmaker. Upcycling gently-used supplies to support aspiring young artists.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      createdAt: '2026-02-05T14:30:00.000Z'
    },
    {
      id: 'usr_maya',
      name: 'Maya Patel',
      email: 'maya@creativestudio.net',
      password: passwordHash,
      role: 'user',
      location: 'Ballard, Seattle',
      bio: 'Ceramicist and mixed-media sculptor. Looking to swap clay tools for heavy acrylic mediums.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      createdAt: '2026-02-12T09:15:00.000Z'
    }
  ];

  writeData(files.USERS_FILE, initialUsers);

  const initialItems = [
    {
      id: 'item_1',
      sellerId: 'usr_sarah',
      title: "Winsor & Newton Artists' Oil Colour Set (10 Tubes, 21ml)",
      description: "Professional grade oil paints with high pigment loading. Tubes are 90% full, only titanium white and ultramarine have been lightly sampled for a color mixing demo. Includes original wooden presentation box.",
      category: 'Paints & Mediums',
      condition: 'Like New',
      price: 45,
      isSwapAvailable: true,
      swapPreferences: 'Willing to swap for high-grade stretched linen canvases (18x24 or larger) or odorless mineral spirits.',
      location: 'Capitol Hill, Seattle',
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: '2026-03-01T10:00:00.000Z'
    },
    {
      id: 'item_2',
      sellerId: 'usr_marcus',
      title: 'Princeton Velvetouch Mixed Media Synthetic Brush Set (8 Pcs)',
      description: 'Super versatile luxury brushes featuring NextGen synthetic filament. Contains round #2, #6, flat wash 1/2", filbert #4, and dagger. Cleaned thoroughly with master brush cleaner, no fraying.',
      category: 'Brushes & Tools',
      condition: 'Like New',
      price: 28,
      isSwapAvailable: true,
      swapPreferences: 'Looking to swap for Fabriano 300gsm cold-press watercolor sheets or masking fluid.',
      location: 'Fremont, Seattle',
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: '2026-03-02T11:30:00.000Z'
    },
    {
      id: 'item_3',
      sellerId: 'usr_maya',
      title: 'Stretched Cotton Canvases 16x20 Inch (Pack of 4, Triple Primed)',
      description: 'Brand new, unopened plastic wrapping. Acid-free 100% cotton canvas with sturdy kiln-dried pine stretcher bars. Triple gesso primed, ready for acrylic or oil work.',
      category: 'Canvases & Surfaces',
      condition: 'Brand New',
      price: 32,
      isSwapAvailable: false,
      swapPreferences: '',
      location: 'Ballard, Seattle',
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: '2026-03-03T09:00:00.000Z'
    },
    {
      id: 'item_4',
      sellerId: 'usr_sarah',
      title: 'Faber-Castell Polychromos Colored Pencils (Set of 36 in Tin)',
      description: 'Artists quality colored pencils with oil-based lead that glides smoothly without wax bloom. Very lightly sharpened twice; all pencils have over 90% length remaining.',
      category: 'Drawing & Illustration',
      condition: 'Gently Used',
      price: 40,
      isSwapAvailable: true,
      swapPreferences: 'Swap for Caran d’Ache Neocolor II watersoluble wax pastels.',
      location: 'Capitol Hill, Seattle',
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: '2026-03-04T15:20:00.000Z'
    },
    {
      id: 'item_5',
      sellerId: 'usr_marcus',
      title: 'Mabef Heavy-Duty Beechwood Studio A-Frame Easel',
      description: 'Crafted in Italy from oiled beech wood. Adjustable height and canvas angle up to 85 inches canvas support. Minor cosmetic acrylic paint splatters that add artistic character. Solid mechanism with ratchet control.',
      category: 'Easels & Furniture',
      condition: 'Gently Used',
      price: 110,
      isSwapAvailable: true,
      swapPreferences: 'Open to partial cash + swap for etching press blankets or lino cutting tools.',
      location: 'Fremont, Seattle',
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: '2026-03-05T13:45:00.000Z'
    },
    {
      id: 'item_6',
      sellerId: 'usr_maya',
      title: 'Kemper Pottery Clay Sculpting Tools 11-Piece Assortment',
      description: 'Double-ended wire and ribbon clay trimming tools, wooden modeling ribs, sponge, and needle tools. Thoroughly sanitized and oiled.',
      category: 'Ceramics & Sculpting',
      condition: 'Gently Used',
      price: 18,
      isSwapAvailable: true,
      swapPreferences: 'Interested in glass cutting tools or metallic gouache.',
      location: 'Ballard, Seattle',
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: '2026-03-06T16:10:00.000Z'
    },
    {
      id: 'item_7',
      sellerId: 'usr_sarah',
      title: 'Liquitex Heavy Body Acrylic Paint Set (6x 59ml Primary Colors)',
      description: 'Rich, thick buttery texture with intense pigment load. Tubes unopened except Titanium White which has ~75% left. Great for impasto technique.',
      category: 'Paints & Mediums',
      condition: 'Like New',
      price: 24,
      isSwapAvailable: true,
      swapPreferences: 'Swap for Golden gloss glazing medium or varnish.',
      location: 'Capitol Hill, Seattle',
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: '2026-03-07T08:30:00.000Z'
    },
    {
      id: 'item_8',
      sellerId: 'usr_marcus',
      title: 'Strathmore 400 Series Heavyweight Mixed Media Spiral Pads (2-pack)',
      description: '300 gsm acid-free sheets, size 9x12 inch. One pad completely untouched with 15 sheets intact; second pad has 13 sheets remaining. Exceptional surface for markers, gouache, and ink wash.',
      category: 'Canvases & Surfaces',
      condition: 'Like New',
      price: 15,
      isSwapAvailable: true,
      swapPreferences: 'Swap for dip pen nibs (Hunt 102/107) and waterproof India ink.',
      location: 'Fremont, Seattle',
      status: 'available',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
      ],
      createdAt: '2026-03-08T14:00:00.000Z'
    }
  ];

  writeData(files.ITEMS_FILE, initialItems);

  const initialSwaps = [
    {
      id: 'swap_1',
      requesterId: 'usr_marcus',
      sellerId: 'usr_sarah',
      targetItemId: 'item_1',
      offeredItemId: 'item_2',
      offeredDescription: "Hi Sarah! I'd love to swap my 8-piece Princeton Velvetouch brush set for your Winsor & Newton Oil set. Can also include a fresh tube of Payne's Grey gouache to balance values!",
      status: 'pending',
      createdAt: '2026-03-08T18:00:00.000Z'
    }
  ];

  writeData(files.SWAPS_FILE, initialSwaps);

  const initialMessages = [
    {
      id: 'conv_1',
      participants: ['usr_marcus', 'usr_sarah'],
      itemId: 'item_1',
      itemTitle: "Winsor & Newton Artists' Oil Colour Set (10 Tubes, 21ml)",
      messages: [
        {
          id: 'msg_1',
          senderId: 'usr_marcus',
          text: 'Hello Sarah! Are you still open to local exchange for the Winsor & Newton oil set? I submitted a swap request with my Velvetouch brush set.',
          timestamp: '2026-03-08T18:05:00.000Z'
        },
        {
          id: 'msg_2',
          senderId: 'usr_sarah',
          text: 'Hi Marcus! Yes, the Velvetouch brushes look fantastic. Are they suitable for water-mixable oils too?',
          timestamp: '2026-03-08T18:20:00.000Z'
        },
        {
          id: 'msg_3',
          senderId: 'usr_marcus',
          text: 'Yes absolutely! They are synthetic so they handle water and solvent mediums without swelling. We could meet up near the Fremont bridge this weekend.',
          timestamp: '2026-03-08T18:25:00.000Z'
        }
      ],
      updatedAt: '2026-03-08T18:25:00.000Z'
    }
  ];

  writeData(files.MESSAGES_FILE, initialMessages);
  console.log('Database successfully seeded with realistic art supplies!');
};
