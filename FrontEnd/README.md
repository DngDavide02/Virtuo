# Virtuo

A modern gaming platform to discover, play, and manage your favorite video games.

---

## What is Virtuo?

Virtuo is a complete platform that lets you explore a vast catalog of free games, with advanced search features, filters, and personal management. Built with modern technologies, it offers a fluid and professional user experience.

## Try it Live

[Live Demo](https://virtuo-demo.example.com) _(Coming soon)_

## Gallery

![Homepage](./screenshots/homepage.png) ![Game Details](./screenshots/game-details.png)

_(Screenshots to be added)_

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

### For Users

- **Registration and Login** - Secure account with JWT
- **Personal Profile** - Manage your preferences
- **Game Library** - Your personal collection

### For Games

- **Complete Catalog** - Hundreds of free games
- **Featured Carousel** - Best games highlighted
- **Advanced Search** - Find what you're looking for instantly
- **Filters and Sorting** - Organize as you prefer
- **Smart Pagination** - Quick navigation through content

### For Experience

- **Responsive Design** - Perfect on all devices
- **Intuitive Interface** - Easy to use
- **Game Details** - All the information you need
- **Contact System** - Write to us for any question

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
