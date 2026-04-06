# 🥻 Silk Drapes — Full-Stack Saree E-Commerce Platform

A complete, production-ready saree e-commerce platform built with **Next.js 14**, **MongoDB**, **Tailwind CSS**, and all features you need to run a live saree store.

---

## ✨ Features

### 🛍️ Customer Portal
| Feature | Details |
|---|---|
| **Browse & Search** | Filter by category, material, price range; full-text search |
| **Product Detail** | Image gallery, zoom, material details, occasion tags, reviews |
| **Favourites** | Heart any saree; saved to account |
| **Add to Cart** | Persist across sessions (Zustand + localStorage) |
| **Buy Now** | One-click to checkout |
| **Auto Location** | IP-based city/state/pincode detection on checkout |
| **Address Book** | Save multiple addresses; set default |
| **Payments** | Scan QR (UPI), enter UPI ID, or Cash on Delivery |
| **Payment Popup** | "Once amount received we confirm the order" flow |
| **Order Tracking** | Step-by-step visual timeline |
| **Email Notifications** | Automatic email on every status change |
| **Return Requests** | Request return within configurable window (default 7 days) |
| **Return Deadline** | Button disabled automatically after return period |
| **Order Confetti** | Celebration animation on successful order 🎉 |

### ⚙️ Admin Portal
| Feature | Details |
|---|---|
| **Dashboard** | Revenue, order counts, pending alerts, low-stock alerts |
| **Product Management** | Add/edit/deactivate products; bulk image upload to Cloudinary |
| **Order Management** | Split-pane view; update status with custom message |
| **Customer Notification** | Every status change fires an email to the customer |
| **Admin Order Alert** | New orders trigger an email to admin |
| **UPI QR Display** | Generated live from env vars; shown in Settings |
| **Return Approval** | Approve returns directly from order panel |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Gmail account (for email, with App Password)
- Cloudinary account (free tier — 25 GB)

### 1. Clone / Extract the Project
```bash
cd saree-store
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# MongoDB Atlas — get from atlas.mongodb.com
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/saree-store

# NextAuth — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-super-secret-minimum-32-chars
NEXTAUTH_URL=http://localhost:3000

# Cloudinary — from cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gmail — use an App Password (not your real password)
# Enable at: myaccount.google.com > Security > App Passwords
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourstore@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=Silk Drapes <yourstore@gmail.com>

# Admin UPI — your UPI payment address
ADMIN_UPI_ID=yourname@upi
ADMIN_UPI_NAME=Silk Drapes
ADMIN_EMAIL=admin@yourstore.com

# Store Config
NEXT_PUBLIC_STORE_NAME=Silk Drapes
NEXT_PUBLIC_RETURN_DAYS=7
```

### 3. Seed Database
```bash
npm run seed
```
This creates:
- Admin account: `admin@silkdrapes.com` / `admin123`
- 6 sample saree products

### 4. Run Development Server
```bash
npm run dev
```

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Customer store |
| http://localhost:3000/admin/dashboard | Admin panel |
| http://localhost:3000/login | Sign in |
| http://localhost:3000/register | Create account |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (customer)/          # Customer-facing pages
│   │   ├── page.tsx          # Homepage with hero slider
│   │   ├── shop/             # Browse & filter
│   │   ├── product/[id]/     # Product detail
│   │   ├── cart/             # Cart management
│   │   ├── checkout/         # Address + payment
│   │   ├── orders/           # Order history
│   │   ├── orders/[id]/      # Order detail + tracking
│   │   ├── favourites/       # Saved products
│   │   └── account/          # Profile + addresses
│   ├── (admin)/              # Admin-only pages
│   │   └── admin/
│   │       ├── dashboard/    # Stats overview
│   │       ├── products/     # CRUD + image upload
│   │       ├── orders/       # Status management
│   │       └── settings/     # UPI config display
│   ├── (auth)/               # Login / Register
│   └── api/                  # All API routes
│       ├── auth/             # NextAuth + register
│       ├── products/         # CRUD + search
│       ├── orders/           # Place + manage
│       ├── payment/          # UPI QR generation
│       ├── upload/           # Cloudinary upload
│       ├── user/             # Profile + favourites + location
│       └── admin/stats/      # Dashboard data
├── components/
│   ├── customer/             # Navbar, Hero, ProductCard, PaymentModal…
│   ├── admin/                # AdminLayout sidebar
│   └── shared/               # Providers, Modal, Loader, OrderTracker
├── models/                   # Mongoose schemas (User, Product, Order)
├── lib/                      # db, email, store (Zustand), utils, seed
├── hooks/                    # useCart, useProduct
├── middleware.ts              # Route protection
└── types/                    # TypeScript interfaces
```

---

## 🔄 Order Flow

```
Customer places order
        ↓
Order created (status: pending) → Email sent to customer + admin
        ↓
Customer pays via UPI QR / UPI ID → "Payment submitted" popup
        ↓
Admin receives email alert → views in Admin > Orders
        ↓
Admin marks as "Payment Received" → email sent to customer
        ↓
Admin marks as "Confirmed" / "Processing" / "Shipped" → email each time
        ↓
Admin marks "Delivered" → return window opens (7 days)
        ↓
Customer can Request Return (within window)
        ↓
Admin approves return → status: "Returned"
```

---

## 💳 Payment Setup

The store uses **UPI-based manual payment verification**:

1. Customer scans the QR or copies the UPI ID
2. Pays via their UPI app (PhonePe, GPay, Paytm, etc.)
3. Customer enters UTR/transaction reference (optional)
4. Admin verifies in their UPI app and marks order as "Payment Received"
5. Customer gets email confirmation

**To use your own UPI:** Just update `ADMIN_UPI_ID` and `ADMIN_UPI_NAME` in `.env.local`. The QR is auto-generated.

---

## 📧 Email Setup (Gmail)

1. Go to **myaccount.google.com → Security → 2-Step Verification** (must be enabled)
2. Go to **myaccount.google.com → Security → App Passwords**
3. Select "Mail" and "Other (Custom name)" → name it "Silk Drapes"
4. Copy the 16-character app password → paste as `EMAIL_PASS`

---

## ☁️ Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Set all `.env.local` variables in Vercel's dashboard under **Settings > Environment Variables**.

Update `NEXTAUTH_URL` to your production domain:
```
NEXTAUTH_URL=https://yourstore.vercel.app
```

---

## 🎨 Customisation

| What | Where |
|------|-------|
| Store name | `NEXT_PUBLIC_STORE_NAME` env + `src/app/layout.tsx` |
| Brand colours | `src/app/globals.css` (`:root` CSS variables) |
| Hero slides | `src/components/customer/HeroSection.tsx` |
| Product categories | `src/models/Product.ts` (enum) + `src/app/(customer)/shop/page.tsx` |
| Return window | `NEXT_PUBLIC_RETURN_DAYS` env variable |
| Shipping threshold | `src/lib/utils.ts` → `FREE_SHIPPING_AT` |
| Email templates | `src/lib/email.ts` |
| Seed data | `src/lib/seed.ts` |

---

## 🔐 Default Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@silkdrapes.com | admin123 |

**Change the admin password immediately after first login** — go to MongoDB Atlas and update the hashed password, or add a "Change Password" API route.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (JWT) |
| State | Zustand (cart persistence) |
| Images | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Payments | UPI QR (qrcode library) |
| Animations | CSS keyframes + react-confetti |
| Toasts | react-hot-toast |
| Icons | lucide-react |

---

## 🐛 Troubleshooting

**"MongoDB connection failed"**
→ Check your `MONGODB_URI`. Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access.

**"Email not sending"**
→ Verify Gmail App Password is correct. Check that 2FA is enabled on the Gmail account.

**"Images not uploading"**
→ Verify all three Cloudinary env vars are set correctly.

**"QR code shows placeholder"**
→ Set `ADMIN_UPI_ID` in `.env.local` and restart the dev server.

**"Cannot find module '@/...'"**
→ Run `npm install` to ensure all dependencies are installed.

---

Built with ❤️ using Claude — Anthropic
