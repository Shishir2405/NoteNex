# 📚 NOTENEX

**The Ultimate Student Note Sharing Platform**

NOTENEX is a comprehensive educational platform that connects students worldwide, enabling seamless sharing of academic notes, collaborative learning, and community building. Built with modern web technologies, it offers a rich ecosystem for students to upload, discover, and access high-quality educational content.

---

## 🌟 Features

### 📝 **Smart Note Management**

- **Upload & Share** - Easy note upload with rich metadata
- **Advanced Search** - AI-powered search with intelligent filtering
- **Quality Control** - Verified content with quality ratings
- **Premium Content** - Monetization system for high-value notes
- **Multi-format Support** - PDF, DOC, and other document formats

### 🎯 **Academic Organization**

- **College-based Filtering** - Institution-specific content discovery
- **Course & Semester Organization** - Structured academic categorization
- **Subject Classification** - Comprehensive subject-wise organization
- **Topic Tagging** - Detailed tagging system for precise content discovery

### 👥 **Social Learning**

- **Study Groups** - Create and join subject-specific communities
- **User Following** - Connect with top contributors and peers
- **Activity Feed** - Stay updated with community activities
- **Comments & Reviews** - Interactive discussion on shared content

### 🏆 **Gamification**

- **Leaderboards** - Top contributors and active users
- **Achievement System** - Recognition for quality contributions
- **User Statistics** - Detailed performance metrics
- **Community Recognition** - Verified contributor badges

### 🔒 **Security & Moderation**

- **Content Approval** - Admin-moderated quality assurance
- **Report System** - Community-driven content moderation
- **User Management** - Comprehensive admin controls
- **Secure Authentication** - JWT-based security system

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/notenex.git
   cd notenex
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:5001/api`

---

## 🛠️ Technology Stack

### **Backend**

- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

### **Frontend** (If applicable)

- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - API communication
- **React Router** - Navigation

### **DevOps & Tools**

- **Docker** - Containerization
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📖 API Documentation

### **Base URL**

```
http://localhost:5001/api
```

### **Authentication**

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Key Endpoints**

#### **Authentication**

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/admin-login` - Admin login
- `GET /auth/me` - Get current user

#### **Notes Management**

- `GET /notes` - Browse all notes with filters
- `POST /notes` - Upload new note
- `GET /notes/:id` - Get note details
- `GET /notes/:id/download` - Download note
- `POST /notes/:id/like` - Like/unlike note

#### **Search & Discovery**

- `GET /search/notes` - Search notes
- `GET /search/suggestions` - Get search suggestions
- `POST /search/advanced` - Advanced search

#### **Community**

- `GET /community/groups` - Browse study groups
- `POST /community/groups` - Create study group
- `POST /community/groups/:id/join` - Join group

#### **Admin Panel**

- `GET /admin/dashboard` - Admin dashboard stats
- `GET /admin/pending-notes` - Pending approvals
- `PUT /admin/notes/:id/approve` - Approve note

For complete API documentation, see [API_DOCS.md](./API_DOCS.md)

---

## 📁 Project Structure

```
notenex/
├── backend/
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
├── frontend/             # React frontend (if applicable)
├── uploads/              # File storage
├── docs/                 # Documentation
├── tests/                # Test files
└── README.md
```

---

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/notenex

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🧪 Testing

### **Run Tests**

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.js
```

### **Test Admin Features**

```bash
# Login as admin
curl -X POST http://localhost:5001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

---

## 🚀 Deployment

### **Using Docker**

```bash
# Build and run with Docker
docker build -t notenex .
docker run -p 5001:5001 notenex
```

### **Using PM2**

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

---

## 📊 Admin Panel

### **Default Admin Credentials**

- **Username:** `admin`
- **Password:** `admin123`

### **Admin Features**

- Dashboard with platform statistics
- User management and moderation
- Content approval and quality control
- Report management
- Analytics and insights

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### **Development Guidelines**

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Follow conventional commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### **Getting Help**

- 📧 Email: support@notenex.com
- 💬 Discord: [NOTENEX Community](https://discord.gg/notenex)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/notenex/issues)

### **Documentation**

- [API Documentation](./docs/API.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Admin Guide](./docs/ADMIN_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🎯 Roadmap

### **Upcoming Features**

- [ ] Mobile application (React Native)
- [ ] Real-time chat in study groups
- [ ] AI-powered content recommendations
- [ ] Integration with LMS platforms
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video note support
- [ ] Collaborative note editing

### **Version History**

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Study groups and community features
- **v1.2.0** - Premium content and monetization
- **v2.0.0** - Advanced search and AI features (planned)

---

## 💡 Why NOTENEX?

**NOTENEX** combines "NOTE" and "NEXUS" - representing our mission to create a central hub (nexus) where students can seamlessly connect, share, and access educational notes. We believe in democratizing education through collaborative learning and knowledge sharing.

### **Our Mission**

To build the world's largest student-driven educational resource platform, making quality learning materials accessible to everyone, everywhere.

---

## 🌟 Acknowledgments

- Built with ❤️ by the NOTENEX team
- Thanks to all contributors and the open-source community
- Special thanks to educators and students who make learning collaborative

---

<div align="center">

**Made with ❤️ for Students, by Students**

[⭐ Star us on GitHub](https://github.com/yourusername/notenex) | [🐛 Report Bug](https://github.com/yourusername/notenex/issues) | [✨ Request Feature](https://github.com/yourusername/notenex/issues)

</div>
