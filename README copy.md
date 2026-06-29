# 🌊 TipSea Point — Luxury Vacation Rental Website

**Private Estate · Hope Town, Elbow Cay, Abaco, The Bahamas**

A full-stack, production-ready luxury vacation rental website built with HTML, Tailwind CSS, GSAP, Express.js, and MongoDB.

---

## 📁 Project Structure

```
tipseapoint/
├── server.js                  # Express server entry point
├── package.json
├── .env.example               # Environment variables template
│
├── models/
│   ├── Booking.js             # Booking schema + pre-save hooks
│   ├── Inquiry.js             # Contact form submissions
│   ├── Review.js              # Guest reviews with approval flow
│   └── BlockedDate.js         # Calendar availability
│
├── routes/
│   ├── bookings.js            # POST /api/bookings, GET availability check
│   ├── inquiries.js           # POST /api/inquiries
│   ├── reviews.js             # GET/POST /api/reviews
│   ├── availability.js        # GET /api/availability/calendar
│   └── admin.js               # JWT-protected admin endpoints
│
├── middleware/
│   └── auth.js                # JWT verification middleware
│
├── scripts/
│   └── seed.js                # Database seeding script
│
└── public/
    ├── index.html             # Main frontend (single-page)
    ├── admin.html             # Admin dashboard
    ├── css/
    │   └── style.css          # Custom CSS (animations, effects)
    └── js/
        └── main.js            # JS: cursor, particles, counters, etc.
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Install dependencies
```bash
cd tipseapoint
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

### 5. Open in browser
- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

---

## 🔑 Admin Credentials (default)

| Field    | Value                        |
|----------|------------------------------|
| Email    | admin@tipseapoint.com        |
| Password | admin123                     |

> ⚠️ Change these in `.env` before production deployment.

---

## 🌐 Frontend Features

| Feature | Detail |
|---------|--------|
| **Hero** | Full-screen parallax, ambient particle system, grain overlay |
| **Custom Cursor** | Dot + ring, expands on interactive elements (desktop) |
| **Marquee Strip** | Infinite scroll property highlights band |
| **Story Section** | Parallax layered images, animated stat counters |
| **Features Grid** | 6-cell GSAP hover lift grid |
| **Gallery** | Horizontal drag-scroll with lightbox zoom |
| **Accommodations** | Room cards with amenity tags |
| **Booking Section** | Real-time price calculator, inline form, API submit |
| **Reviews** | 3-column card grid, loaded from DB |
| **Location** | Coordinate display + Google Maps link |
| **FAQ** | Animated accordion |
| **Contact** | Inquiry form with API submit |
| **Footer** | 4-column grid, social links |
| **Floating CTA** | Appears after hero, disappears near footer |
| **Scroll Progress** | Cyan/gold gradient bar at top of page |
| **Site Loader** | Branded wave-bar animation |
| **Notifications** | Toast system for form feedback |
| **Responsive** | Full mobile/tablet layout, hamburger menu |

---

## 🔒 Backend API

### Public Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/bookings` | Submit reservation request |
| `GET`  | `/api/bookings/check-availability?checkIn=&checkOut=` | Check date availability |
| `GET`  | `/api/bookings/confirm/:code` | Look up by confirmation code |
| `POST` | `/api/inquiries` | Submit contact inquiry |
| `GET`  | `/api/availability/calendar?year=&month=` | Get blocked dates |
| `GET`  | `/api/reviews` | Get approved reviews |
| `POST` | `/api/reviews` | Submit a review |

### Admin Endpoints (JWT required)
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/admin/login` | Authenticate, receive JWT |
| `GET`  | `/api/admin/stats` | Dashboard stats + recent bookings |
| `GET`  | `/api/admin/bookings` | All bookings (filter by status) |
| `PATCH`| `/api/admin/bookings/:id` | Update booking status |
| `GET`  | `/api/admin/inquiries` | All inquiries |
| `PATCH`| `/api/admin/reviews/:id` | Approve / feature review |
| `POST` | `/api/admin/block-dates` | Manually block dates |
| `DELETE`| `/api/admin/block-dates` | Unblock dates |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--ocean-midnight` | `#0A1628` | Page background |
| `--deep-water` | `#1B4F72` | Alternate dark |
| `--cyan` | `#00B4D8` | Primary accent, borders |
| `--gold` | `#F0C040` | Stats, prices, stars |
| `--sand` | `#F8F4EE` | Primary text |
| `--teal` | `#2C7873` | Secondary accent |

**Typefaces:**
- Display: Cormorant Garamond (luxury serif)
- Body: DM Sans (clean, modern)
- Utility: Space Mono (labels, coordinates, codes)

---

## ☁️ Deployment

### MongoDB Atlas
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Set `MONGODB_URI` in `.env`

### Render / Railway / Fly.io
```bash
# Set environment variables in dashboard, then:
npm start
```

### Nginx + PM2 (VPS)
```bash
pm2 start server.js --name tipseapoint
pm2 save
```

---

## 📸 Photography Credits
Images sourced from Unsplash (free commercial license). Replace with actual TipSea Point photography for production.

---

*Built with ❤️ for TipSea Point — Hope Town, Elbow Cay, Abaco, The Bahamas.*
