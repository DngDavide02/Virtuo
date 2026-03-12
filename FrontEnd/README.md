# Virtuo

A modern gaming platform to discover, play, and manage your favorite video games.

---

## What is Virtuo?

Virtuo is a complete platform that lets you explore a vast catalog of free games, with advanced search features, filters, and personal management. Built with modern technologies, it offers a fluid and professional user experience.

## Gallery

### Application Screenshots

![Homepage - Game Discovery](./ScreenShot/Screenshot%202026-03-12%20113718.png)
_Homepage with featured games carousel and search functionality_

![Discover Games](./ScreenShot/Screenshot%202026-03-12%20113835.png)
_Advanced game discovery with filters and category navigation_

![User Profile](./ScreenShot/Screenshot%202026-03-12%20113931.png)
_User profile page with personal library and preferences_

![Chat Assistant](./ScreenShot/Screenshot%202026-03-12%20115548.png)
_Intelligent chat assistant providing game recommendations and support_

## Technologies Used

### Frontend

- **React 19** - Modern and reactive user interface
- **Vite** - Fast development and optimized builds
- **Bootstrap 5** - Responsive and professional design
- **React Router** - Smooth navigation between pages

### Backend

- **Spring Boot 3.5** - Robust and secure REST APIs
- **Java 21** - Latest version of the language
- **Spring Security** - Authentication and authorization
- **JWT Tokens** - Secure login without sessions
- **PostgreSQL** - Powerful and reliable database

## Main Features

### User Authentication & Profile Management

- **Registration and Login** - Secure account with JWT tokens
- **Personal Profile** - Manage your gaming preferences and statistics
- **Avatar Customization** - Personalize your gaming identity

### Game Discovery & Management

- **Complete Catalog** - Hundreds of free games with detailed information
- **Featured Carousel** - Best and trending games highlighted on homepage
- **Advanced Search** - Find games by name, genre, or platform
- **Smart Filters** - Refine results by category, rating, or release date
- **Personal Library** - Add, organize, and track your game collection

### Intelligent Chat Assistant

- **AI-Powered Gaming Assistant** - Get personalized game recommendations and help
- **Natural Conversations** - Context-aware responses that remember your preferences
- **Game Expertise** - Detailed information about gameplay, story, and features
- **Smart Follow-ups** - Intelligent questions based on conversation context

### User Experience

- **Responsive Design** - Perfect experience on desktop, tablet, and mobile
- **Intuitive Interface** - Easy navigation and game discovery
- **Real-time Updates** - Instant notifications and chat responses
- **Performance Optimized** - Fast loading and smooth interactions

### For Experience

- **Responsive Design** - Perfect on all devices
- **Intuitive Interface** - Easy to use
- **Game Details** - All information you need
- **Contact System** - Write to us for any question
- **Intelligent Chat** - AI-powered gaming assistant with context awareness

### Intelligent Chat System

Our advanced chat system features:

**AI-Powered Responses**: Natural conversation flow with intelligent intent recognition
**Game Expertise**: Detailed knowledge of popular games and genres
**Context Awareness**: Remembers conversation history for relevant follow-ups
**Dynamic Interactions**: Adapts responses based on user preferences
**Responsive Design**: Optimized for all devices with smooth animations

**Key Features:**

- Pattern-based intent recognition (recommendations, help, new releases)
- Comprehensive game database with detailed information
- Smart follow-up questions and contextual responses
- Multiple response templates for natural conversation flow
- Performance-optimized with React hooks and memoization

## Project Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     App         │    │     Server      │    │    Database     │
│                 │    │                 │    │                 │
│ React + Vite    │◄──►│  Spring Boot    │◄──►│  PostgreSQL     │
│ Bootstrap UI     │    │  REST API       │    │   JPA/Hibernate │
│ React Router    │    │  JWT Auth       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Project Structure

### Frontend

```bash
src/
├── components/     # Reusable components
├── hooks/         # Custom logic
├── pages/         # Main pages
├── css/           # CSS styles
└── assets/        # Images and resources
```

### Backend

```bash
src/main/java/
├── controller/    # API endpoints
├── service/       # Business logic
├── repository/    # Data access
├── entities/      # Database models
└── security/      # Authentication
```

## How to Run the Project

### Prerequisites

- **Node.js 18+** and npm
- **Java 21** or higher
- **PostgreSQL** database
- **Maven** for backend

### Quick Setup

```bash
# 1. Clone the project
git clone https://github.com/yourname/virtuo.git
cd virtuo

# 2. Start the backend
cd BackEnd
mvn spring-boot:run

# 3. Start the frontend (in another terminal)
cd FrontEnd
npm install
npm run dev
```

### Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

## Configuration

Create the `.env` file with these variables:

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/virtuo_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=very-long-secret-key
JWT_EXPIRATION=86400000

# Email (Mailgun)
MAILGUN_DOMAIN=your-domain
MAILGUN_API_KEY=your-api-key
```

## Main APIs

### Authentication

- `POST /api/auth/register` - New user registration
- `POST /api/auth/login` - User login

### Games

- `GET /api/games` - List all games
- `GET /api/games/{id}` - Specific game details
- `GET /api/games/search?q=` - Search games by name

### User Library

- `GET /api/users/{username}/library` - Your library
- `POST /api/library/add` - Add game to library
- `DELETE /api/library/{id}` - Remove game

## What's Coming

### New Features

- **Mobile App** - Smartphone version
- **Review System** - Rate and comment on games
- **Wishlist** - Save games to try later
- **Social Features** - Friends and sharing
- **Admin Panel** - Content management

### Technical Improvements

- **Docker** - Simplified deployment
- **CI/CD** - Automated testing and deployment
- **Analytics** - Metrics and performance
- **Security** - Advanced protections

## How to Contribute

Want to help us improve Virtuo? Perfect!

1. **Fork** the project
2. **Create** a branch: `git checkout -b feature/your-feature`
3. **Develop** your idea
4. **Send** a Pull Request

### Guidelines

- Follow the existing code style
- Write clear and descriptive commits
- Add tests for new features
- Document important changes

## License

This project is distributed under MIT license - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the gaming community**

> Virtuo - Discover, Play, Manage Your Gaming World
