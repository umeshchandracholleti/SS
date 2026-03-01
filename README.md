# Sai Scientifics - Full Stack E-Commerce Platform

Modern e-commerce platform for scientific equipment and supplies, built with React, Node.js, and PostgreSQL.

---

## 🚀 Quick Start

### For Development
```powershell
# Frontend
cd myapp
npm install
npm run dev

# Backend
cd myapp/server
npm install
npm run dev
```

### For Deployment
👉 **Follow the guides in this order:**

1. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Quick reference checklist ⭐ **START HERE**
2. **[COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md)** - Comprehensive step-by-step guide
3. **[PHASE4_BACKEND_DEPLOYMENT.md](PHASE4_BACKEND_DEPLOYMENT.md)** - Backend (Render) detailed guide
4. **[PHASE5_FRONTEND_DEPLOYMENT.md](PHASE5_FRONTEND_DEPLOYMENT.md)** - Frontend (Netlify) detailed guide

---

## 📚 Project Structure

```
SS/
├── myapp/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/ui/         # Reusable UI components (ShadCN)
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API layer (Axios)
│   │   ├── context/               # React Context (Auth)
│   │   └── lib/                   # Utilities
│   ├── public/                    # Static assets
│   ├── netlify.toml              # Netlify configuration
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
│
├── myapp/server/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/               # API endpoints
│   │   ├── middleware/           # Express middleware
│   │   ├── db.js                # Database connection
│   │   └── index.js             # Server entry point
│   ├── scripts/
│   │   └── migrate.js           # Database migration
│   ├── render.yaml              # Render configuration
│   ├── package.json             # Backend dependencies
│   ├── API_DOCUMENTATION.md     # API reference (20+ endpoints)
│   └── README.md                # Backend setup guide
│
├── DEPLOYMENT_CHECKLIST.md        # Quick deployment steps ⭐
├── COMPLETE_DEPLOYMENT_GUIDE.md   # Full deployment guide
├── PHASE4_BACKEND_DEPLOYMENT.md   # Render (backend) guide
└── PHASE5_FRONTEND_DEPLOYMENT.md  # Netlify (frontend) guide
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI library
- **Vite 7.3** - Build tool
- **Tailwind CSS v4** - Styling
- **ShadCN UI** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Infrastructure
- **Netlify** - Frontend hosting (CDN)
- **Render** - Backend hosting
- **Supabase** - PostgreSQL database
- **GitHub** - Version control & CI/CD

---

## 🌐 Live Deployment

### Production URLs
```
Frontend: https://saiscientifics.netlify.app (after Phase 5)
Backend:  https://saiscientifics-backend.onrender.com (after Phase 4)
Database: Supabase PostgreSQL (AWS us-west-1)
```

### API Endpoints
Full documentation: [myapp/server/API_DOCUMENTATION.md](myapp/server/API_DOCUMENTATION.md)

**Key endpoints:**
- `GET /api/health` - Service health check
- `GET /api/health/db` - Database connection check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - List products
- `POST /api/cart` - Manage shopping cart
- `POST /api/orders` - Create orders
- `POST /api/payment/create` - Payment processing

---

## 📦 Features

### Implemented
- ✅ Modern React 19 frontend with Tailwind CSS v4
- ✅ RESTful API with Express
- ✅ PostgreSQL database (12 tables)
- ✅ JWT authentication
- ✅ API service layer with Axios
- ✅ Authentication context
- ✅ Production-ready deployment configuration
- ✅ Health monitoring endpoints
- ✅ CORS security
- ✅ Environment-based configuration

### Planned
- 🔜 User registration and login UI
- 🔜 Product catalog and search
- 🔜 Shopping cart functionality
- 🔜 Order management
- 🔜 Payment integration (Razorpay)
- 🔜 Email notifications
- 🔜 SMS tracking (Twilio)
- 🔜 Request for Quote system
- 🔜 Support ticket system

---

## 🗄️ Database Schema

**12 Tables:**
1. `users` - User accounts
2. `user_addresses` - Shipping addresses
3. `products` - Product catalog
4. `product_images` - Product photos
5. `categories` - Product categories
6. `product_categories` - Many-to-many relationship
7. `cart_items` - Shopping cart
8. `orders` - Order records
9. `order_items` - Order line items
10. `payments` - Payment transactions
11. `rfqs` - Request for Quote
12. `support_tickets` - Customer support

Full schema: [myapp/server/scripts/migrate.js](myapp/server/scripts/migrate.js)

---

## ⚙️ Configuration

### Environment Variables

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:4000  # Development
# or
VITE_API_URL=https://your-backend.onrender.com  # Production
```

**Backend (`.env.local`):**
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
CORS_ORIGIN=*  # or specific frontend URL
```

See `.env.example` files for full configuration.

---

## 🚀 Deployment Guide

### Prerequisites
- GitHub account
- Supabase account (free tier)
- Render account (free tier)
- Netlify account (free tier)

### Deployment Steps

**Option 1: Quick Start (30 minutes)**
Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for a concise step-by-step checklist.

**Option 2: Detailed Guide (with troubleshooting)**
Follow [COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md) for comprehensive instructions.

**Architecture:**
```
User → Netlify (Frontend) → Render (Backend) → Supabase (Database)
```

### Deployment Order
1. ✅ **Backend First** - Deploy to Render, get backend URL
2. ✅ **Frontend Second** - Deploy to Netlify with backend URL
3. ✅ **Update CORS** - Configure backend to allow frontend

---

## 🧪 Testing

### Run Tests
```powershell
# Frontend tests
cd myapp
npm test

# Backend tests
cd myapp/server
npm test
```

### Manual Testing
1. **Local Development:**
   - Backend: http://localhost:4000
   - Frontend: http://localhost:5173

2. **Health Checks:**
   - Backend: http://localhost:4000/api/health
   - Database: http://localhost:4000/api/health/db

3. **Production:**
   - Backend: https://your-backend.onrender.com/api/health
   - Frontend: https://your-site.netlify.app

---

## 📖 Documentation

### For Developers
- **[myapp/README.md](myapp/README.md)** - Frontend development guide
- **[myapp/server/README.md](myapp/server/README.md)** - Backend development guide
- **[myapp/server/API_DOCUMENTATION.md](myapp/server/API_DOCUMENTATION.md)** - Complete API reference
- **[myapp/DEVELOPER_QUICK_REFERENCE.md](myapp/DEVELOPER_QUICK_REFERENCE.md)** - Quick dev reference

### For Deployment
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Quick checklist ⭐
- **[COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md)** - Full guide
- **[PHASE4_BACKEND_DEPLOYMENT.md](PHASE4_BACKEND_DEPLOYMENT.md)** - Backend setup
- **[PHASE5_FRONTEND_DEPLOYMENT.md](PHASE5_FRONTEND_DEPLOYMENT.md)** - Frontend setup
- **[myapp/server/RENDER_DEPLOYMENT_GUIDE.md](myapp/server/RENDER_DEPLOYMENT_GUIDE.md)** - Render specifics

### For Repository Split
- **[REPO_SPLIT_SETUP_GUIDE.md](myapp/REPO_SPLIT_SETUP_GUIDE.md)** - Split into separate repos

---

## 🤝 Contributing

### Development Workflow
```powershell
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm run dev
npm test

# Commit and push
git add .
git commit -m "Add your feature"
git push origin feature/your-feature

# Create Pull Request on GitHub
```

### Code Standards
- ESLint for JavaScript linting
- Prettier for code formatting (optional)
- Conventional commits preferred

---

## 🔒 Security

### Best Practices
- ✅ Environment variables for secrets (never commit `.env`)
- ✅ JWT authentication with secure secrets
- ✅ CORS configured for specific origins
- ✅ Helmet.js for security headers
- ✅ bcrypt for password hashing
- ✅ Prepared statements (SQL injection prevention)
- ✅ HTTPS everywhere (automatic on Netlify + Render)

### Security Checklist
- [ ] No hardcoded secrets in code
- [ ] `.env` files in `.gitignore`
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] CORS restricted to your domain (not `*`)
- [ ] Database credentials secure
- [ ] API rate limiting (future)

---

## 📊 Project Status

### Phase Progress
- ✅ **Phase 1**: Repository split preparation
- ✅ **Phase 2**: Supabase database migration (12 tables)
- ✅ **Phase 3**: Frontend modernization (React 19 + Tailwind v4)
- 🟡 **Phase 4**: Backend deployment to Render (ready to deploy)
- ⬜ **Phase 5**: Frontend deployment to Netlify (after Phase 4)
- ⬜ **Phase 6**: Documentation updates
- ⬜ **Phase 7**: Integration testing
- ⬜ **Phase 8**: Demo video and submission

### Next Steps
1. Deploy backend to Render (follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md))
2. Deploy frontend to Netlify
3. Complete integration testing
4. Record demo video

---

## 💰 Costs

### Development & Deployment (Free Tier)
- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Render**: Free (750 hours/month, spins down after 15min)
- **Netlify**: Free (100GB bandwidth/month)
- **GitHub**: Free (unlimited public repos)
- **Total**: **$0/month** for development and MVP

### Optional Upgrades
- Render Starter: $7/mo (always-on, no spin-down)
- Netlify Pro: $19/mo (advanced features)
- Supabase Pro: $25/mo (8GB database)

---

## 📞 Support & Links

### Resources
- **Frontend Issues**: Check [myapp/README.md](myapp/README.md)
- **Backend Issues**: Check [myapp/server/README.md](myapp/server/README.md)
- **Deployment Issues**: Check [COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md)
- **API Reference**: [myapp/server/API_DOCUMENTATION.md](myapp/server/API_DOCUMENTATION.md)

### External Documentation
- React: [react.dev](https://react.dev)
- Vite: [vitejs.dev](https://vitejs.dev)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com)
- Express: [expressjs.com](https://expressjs.com)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Render: [render.com/docs](https://render.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)

---

## 📝 License

This project is private. All rights reserved.

---

## 🎯 Getting Started

**New to this project?**

1. Read this README
2. Check [myapp/README.md](myapp/README.md) for frontend setup
3. Check [myapp/server/README.md](myapp/server/README.md) for backend setup
4. When ready to deploy, use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**Ready to deploy?**

👉 **Start here**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

**Happy Coding! 🚀**
