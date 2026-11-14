# Art Supply Exchange & Second-hand Material Marketplace

A responsive full-stack web application for art students, educators, hobbyists, and professional artists to buy, sell, and swap unused or gently-used creative supplies, fostering affordability, sustainability, and local community connections.

---

## 🎨 Key Features & Interconnected Pages

1. **Marketplace & Discovery (`/`)**:
   - Live full-text search across titles, descriptions, and swap preferences.
   - Filters for Category (*Paints & Mediums, Brushes & Tools, Canvases & Surfaces, Drawing & Illustration, Easels & Furniture, Ceramics & Sculpting*).
   - Filter by Condition (*Brand New, Like New, Gently Used, Well Used*) and Swap-eligibility.
   - Price sorting (Newest, Low to High, High to Low).

2. **Product Detail View (`/item/:id`)**:
   - High-definition image display, seller credentials, location badges, and detailed condition notes.
   - Direct CTA buttons: **"Message & Buy"** and **"Propose Swap"**.

3. **Material Swap & Trade Hub (`/swaps`)**:
   - Manage incoming and outgoing barter exchange proposals.
   - Offer items from your own inventory or submit custom trade notes.
   - Accept, decline, or mark swaps as completed.

4. **Artist Chat & Negotiation Module (`/chat`)**:
   - Direct conversation threads linking buyers and sellers with attached item context cards.
   - Coordinate local exchange points, inspect conditions, and discuss pricing.

5. **User Dashboard (`/dashboard`)**:
   - Summary statistics of user listings and active swaps.
   - Add new art supplies with photo URL, category, condition, price, and swap acceptance.
   - Manage statuses: *Available*, *Reserved*, *Sold*, or *Swapped*.

6. **Administrative Management Panel (`/admin`)**:
   - Overview metrics: Total Artists, Total Listed, Active Items, Swap Requests, Completed Barters, and Negotiations.
   - Community user management (role promotion/demotion).
   - Listing moderation with one-click deletion for spam or inappropriate items.

7. **Authentication (`/login`, `/register`)**:
   - Secure JWT token authentication with bcrypt password hashing.
   - Convenient 1-click test accounts for evaluation.

---

## 🚀 Getting Started

### 1. Install & Run Locally

```bash
# Install root dependencies
npm install

# Run the complete application (Server & Frontend combined)
npm run start
```
The server will start at: `http://localhost:5000`

### 2. Available Demo Accounts
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@artexchange.org` | `password123` |
| **Artist User** | `sarah@studioart.com` | `password123` |
| **Artist User** | `marcus@pleinair.org` | `password123` |
