# Art Competition Booking Application

A full-stack web application for managing and booking art competition entries. Built with React, TypeScript, Node.js, Express, and SQLite.

## Features

### For Users
- Browse available art competitions
- Filter competitions by category and status
- View detailed competition information
- Register and login to manage bookings
- Book entries for art competitions
- Submit artwork title and description
- View and manage your bookings
- Cancel bookings

### For Administrators
- Create new art competitions
- Edit competition details
- Change competition status (open/closed/completed)
- Delete competitions
- View all bookings across competitions
- Monitor participant counts

## Technology Stack

### Backend
- Node.js
- Express.js
- TypeScript
- SQLite3 (database)
- JWT (authentication)
- bcryptjs (password hashing)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Vite (build tool)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd art-competition
```

2. Install all dependencies:
```bash
npm run install-all
```

Or install manually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
cd ..
```

3. Set up environment variables:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the values:
```
PORT=5000
JWT_SECRET=your-secure-secret-key-here
NODE_ENV=development
```

### Running the Application

#### Development Mode (Both Backend and Frontend)
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

#### Run Backend Only
```bash
cd backend
npm run dev
```

#### Run Frontend Only
```bash
cd frontend
npm run dev
```

### Building for Production

```bash
npm run build
```

This will:
1. Compile TypeScript backend code to `backend/dist/`
2. Build optimized frontend bundle to `frontend/dist/`

### Running Production Build

```bash
npm start
```

## Project Structure

```
art-competition/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts          # Authentication routes
│   │   │   ├── competitions.ts  # Competition management routes
│   │   │   └── bookings.ts      # Booking routes
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT authentication middleware
│   │   ├── database.ts          # Database setup and queries
│   │   ├── types.ts             # TypeScript type definitions
│   │   └── server.ts            # Express server setup
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── Register.tsx          # Registration page
│   │   │   ├── CompetitionList.tsx   # Competition listing
│   │   │   ├── CompetitionDetail.tsx # Competition details & booking
│   │   │   ├── MyBookings.tsx        # User bookings page
│   │   │   └── AdminPanel.tsx        # Admin management panel
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── api.ts               # API service layer
│   │   ├── types.ts             # TypeScript types
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── package.json                 # Root package.json

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Competitions
- `GET /api/competitions` - Get all competitions (supports filtering)
- `GET /api/competitions/:id` - Get competition by ID
- `POST /api/competitions` - Create competition (admin only)
- `PUT /api/competitions/:id` - Update competition (admin only)
- `DELETE /api/competitions/:id` - Delete competition (admin only)

### Bookings
- `GET /api/bookings/my-bookings` - Get current user's bookings
- `GET /api/bookings` - Get all bookings (admin only)
- `POST /api/bookings` - Create a booking
- `DELETE /api/bookings/:id` - Cancel a booking

## Usage Guide

### Creating an Account
1. Click "Register" in the navigation bar
2. Fill in your name, email, and password
3. Submit the form to create your account

### Booking a Competition
1. Browse available competitions on the home page
2. Click on a competition to view details
3. If logged in and competition is open, fill in artwork details (optional)
4. Click "Book Now" to confirm your entry

### Admin Features
To access admin features, you need to manually set a user's role to 'admin' in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

Admin users can:
- Access the Admin Panel from the navigation bar
- Create new competitions
- Edit competition status
- Delete competitions
- View all bookings

## Database Schema

### Users Table
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password (TEXT - hashed)
- name (TEXT)
- role (TEXT - 'user' or 'admin')
- created_at (DATETIME)

### Competitions Table
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- category (TEXT)
- date (DATE)
- location (TEXT)
- max_participants (INTEGER)
- current_participants (INTEGER)
- entry_fee (REAL)
- image_url (TEXT)
- status (TEXT - 'open', 'closed', 'completed')
- created_at (DATETIME)

### Bookings Table
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER)
- competition_id (INTEGER)
- booking_date (DATETIME)
- status (TEXT - 'confirmed', 'cancelled')
- payment_status (TEXT - 'pending', 'paid', 'refunded')
- artwork_title (TEXT)
- artwork_description (TEXT)

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes and API endpoints
- Input validation
- CORS enabled
- SQL injection prevention through parameterized queries

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Email notifications
- File upload for artwork submissions
- Competition results and winner announcements
- User profiles with portfolio
- Advanced search and filtering
- Export bookings to CSV/PDF
- Multi-language support
- Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
