# GigFlow - Mini Freelance Marketplace

GigFlow is a full-stack platform where clients can post jobs and freelancers can bid on them. It features secure authentication, real-time notifications, and high transactional integrity for the hiring process.

## Features

- **🛡️ Secure Authentication**: JWT-based auth with HttpOnly cookies.
- **💼 Gig Management**: Create, browse, and search for projects.
- **📈 Bidding System**: Freelancers can submit proposals and prices.
- **🤝 Strategic Hiring**: Clients review bids and hire freelancers using MongoDB Transactions (Atomic updates).
- **🔔 Real-time Notifications**: Instant updates when you're hired, powered by Socket.io.
- **💎 Premium UI**: Modern, responsive design with Tailwind CSS and Framer Motion.

## Technical Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Redux Toolkit, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io.
- **State Management**: Redux Toolkit for Auth and Gigs.
- **Real-time**: Socket.io for notifications.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Backend Setup

1. `cd server`
2. `npm install`
3. Create a `.env` file based on `.env.example`
4. `npm run dev`

### Frontend Setup

1. `cd client`
2. `npm install`
3. `npm run dev`

## API Endpoints

| Category | Method | Endpoint | Description |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | Register new user |
| Auth | POST | `/api/auth/login` | Login & set cookie |
| Gigs | GET | `/api/gigs` | Fetch open gigs |
| Gigs | POST | `/api/gigs` | Create a new job post |
| Bids | POST | `/api/bids` | Submit a bid |
| Bids | GET | `/api/bids/:gigId` | Get all bids for a gig |
| Hiring | PATCH | `/api/bids/:bidId/hire` | Atomic hire logic |

## Submission Details

- **Author**: Pratyush (for ServiceHive Assignment)
- **Role**: Full Stack Developer Intern
