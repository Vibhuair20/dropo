# 🚀 Dropo - Modern File Management System

A full-stack file management application built with Next.js, featuring secure authentication, cloud storage, and an intuitive user interface.

![Dropo Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication & Security
- **Clerk Authentication**: Secure user registration and login
- **Email Verification**: Two-factor email verification process
- **Protected Routes**: Middleware-based route protection
- **User Sessions**: Persistent user sessions

### 📁 File Management
- **File Upload**: Drag & drop file upload with progress tracking
- **Image Support**: Optimized image storage and delivery
- **PDF Support**: Document management capabilities
- **Folder Organization**: Hierarchical folder structure
- **File Operations**: Star, trash, delete, and download files

### 🎨 User Interface
- **Modern UI**: Built with HeroUI components
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Theme**: Theme switching capability
- **Real-time Updates**: Live file list updates
- **Toast Notifications**: User feedback system

### 🔍 File Organization
- **Smart Filtering**: Filter by starred, trash, or all files
- **Folder Navigation**: Breadcrumb navigation system
- **File Search**: Search through file names and content
- **Bulk Operations**: Multi-file selection and operations

## 🛠 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **HeroUI**: Modern component library
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **Axios**: HTTP client for API calls

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Drizzle ORM**: Type-safe database queries
- **PostgreSQL**: Primary database (Neon)
- **ImageKit**: Cloud file storage and CDN
- **Clerk**: Authentication and user management

### Infrastructure
- **Vercel**: Hosting and deployment
- **Neon**: Serverless PostgreSQL database
- **ImageKit**: File storage and image optimization

## 🏗 Architecture

```
dropo/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── files/         # File management APIs
│   │   ├── folders/       # Folder operations
│   │   ├── upload/        # File upload handling
│   │   └── imagekit-auth/ # ImageKit authentication
│   ├── dashboard/         # Main dashboard page
│   ├── sign-in/          # Authentication pages
│   └── sign-up/          # User registration
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── FileList.tsx      # File listing component
│   ├── FileUpload.tsx    # Upload interface
│   └── Dashboard.tsx     # Main dashboard
├── lib/                  # Utility libraries
│   ├── db/              # Database configuration
│   └── utils.ts         # Helper functions
├── schema/              # Zod validation schemas
└── drizzle/             # Database migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- ImageKit account
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dropo.git
   cd dropo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@host:port/database

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
   CLERK_SECRET_KEY=sk_test_your_key

   # ImageKit Configuration
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
   ```

4. **Database Setup**
   ```bash
   npm run db:generate  # Generate migrations
   npm run db:migrate   # Run migrations
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📚 API Documentation

### File Management APIs

#### `GET /api/files`
Fetch user files with optional parent folder filtering.

**Query Parameters:**
- `userId` (required): User ID
- `parentId` (optional): Parent folder ID

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "file.jpg",
    "path": "/path/to/file",
    "size": "1024",
    "type": "image/jpeg",
    "fileURL": "https://...",
    "thumbnailURL": "https://...",
    "userId": "user_id",
    "parentId": "parent_id",
    "isFolder": false,
    "isStarred": false,
    "isTrash": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### `POST /api/files/upload`
Upload a new file to the system.

**Form Data:**
- `file`: File to upload
- `userId`: User ID
- `parentId` (optional): Parent folder ID

#### `PATCH /api/files/[fileId]/star`
Toggle star status of a file.

#### `PATCH /api/files/[fileId]/trash`
Move file to/from trash.

#### `DELETE /api/files/[fileId]/delete`
Permanently delete a file.

### Folder Management APIs

#### `POST /api/folders/create`
Create a new folder.

**Request Body:**
```json
{
  "name": "Folder Name",
  "userId": "user_id",
  "parentId": "parent_id"
}
```

### Authentication APIs

#### `GET /api/imagekit-auth`
Get ImageKit authentication parameters for client-side uploads.

## 🗄 Database Schema

### Files Table
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  user_id TEXT NOT NULL,
  parent_id TEXT NOT NULL,
  is_folder BOOLEAN NOT NULL DEFAULT false,
  is_starred BOOLEAN NOT NULL DEFAULT false,
  is_trash BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Key Features:
- **UUID Primary Keys**: Scalable ID system
- **Hierarchical Structure**: Parent-child relationships
- **File Metadata**: Size, type, and URL storage
- **Status Flags**: Starred, trash, and folder indicators
- **Timestamps**: Creation and update tracking

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Configure build settings

2. **Environment Variables**
   Set the following in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`

3. **Database Migration**
   ```bash
   npm run db:migrate
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Configuration

#### Development
- Use local PostgreSQL or Neon development database
- Configure Clerk development keys
- Use ImageKit development environment

#### Production
- Use production PostgreSQL database
- Configure Clerk production keys
- Use ImageKit production environment
- Enable HTTPS and security headers

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
```

### Code Structure

#### Components
- **Functional Components**: All components use React hooks
- **TypeScript**: Full type safety throughout
- **Props Interface**: Clear component contracts
- **Error Boundaries**: Graceful error handling

#### API Routes
- **Serverless Functions**: Vercel serverless deployment
- **Authentication**: Clerk middleware integration
- **Error Handling**: Comprehensive error responses
- **Validation**: Request/response validation

#### Database
- **Type Safety**: Drizzle ORM with TypeScript
- **Migrations**: Version-controlled schema changes
- **Relations**: Proper foreign key relationships
- **Indexing**: Optimized query performance

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- **TypeScript**: Use strict type checking
- **ESLint**: Follow linting rules
- **Testing**: Write unit and integration tests
- **Documentation**: Update README and code comments
- **Commits**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Clerk**: For authentication services
- **ImageKit**: For file storage and CDN
- **HeroUI**: For beautiful components
- **Drizzle**: For type-safe database operations

## 📞 Support

For support, email support@dropo.com or join our Slack channel.

---

**Built with ❤️ by the Dropo Team**
