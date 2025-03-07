Smart Park Monthly User Management
Overview
Smart Park Monthly User Management is a secure, responsive web application for managing park resources, visitor data, and operational aspects of conservation areas and national parks. Built with Next.js and Firebase, it provides an intuitive interface for park administrators and staff to monitor and manage park operations efficiently.
Key Features

Secure Authentication: Robust user authentication system using Firebase and NextAuth.js
Role-Based Access Control: Different access levels for administrators, rangers, and staff
Dashboard Analytics: Real-time insights into park visitation, resource usage, and wildlife data
Resource Management: Track and manage park resources, equipment, and infrastructure
Visitor Management: Monitor visitor entries, generate reports, and analyze visitor patterns
Responsive Design: Works seamlessly on desktop and mobile devices for field operations

Technical Stack

Frontend: Next.js, React, TailwindCSS with DaisyUI
Authentication: Firebase Authentication with NextAuth.js
Database: Firebase Firestore
Hosting: Vercel/Firebase Hosting

Getting Started
Prerequisites

Node.js (v14 or newer)
npm or yarn
Firebase account

Installation

Clone the repository:
bashCopygit clone https://github.com/your-username/smartparks-management.git
cd smartparks-management

Install dependencies:
bashCopynpm install

# or

yarn install

Set up environment variables:
Create a .env.local file in the root directory with the following variables:
Copy# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# Firebase Client SDK (exposed to browser)

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# NextAuth

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

Run the development server:
bashCopynpm run dev

# or

yarn dev

Open http://localhost:3000 in your browser to see the application.

Deployment
The application can be easily deployed to Vercel or Firebase Hosting:
Vercel Deployment
bashCopynpm run build
vercel --prod
Firebase Hosting Deployment
bashCopynpm run build
firebase deploy
Security
The SmartParks Management System implements several security features:

Secure authentication with Firebase
JWT-based session management
Role-based access controls
Secure Firestore database rules
Server-side authentication validation

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
