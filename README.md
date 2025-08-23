# Next.js Prisma Auth Boilerplate

A complete, production-ready authentication starter kit for modern web applications built with Next.js 15, Prisma ORM, and NextAuth.js v5.

## What Problem Does This Solve?

Building authentication from scratch is **time-consuming**, **error-prone**, and **security-critical**. This boilerplate solves these common challenges:

### Common Authentication Pain Points:
- **Time Waste**: Spending weeks implementing auth instead of building your core features
- **Security Risks**: Missing edge cases, improper session handling, vulnerable endpoints
- **Complexity**: Managing multiple auth providers, email verification, password resets
- **Type Safety**: Lack of proper TypeScript integration with auth state
- **User Experience**: Poor error handling, confusing flows, no loading states
- **Maintenance**: Hard to update, extend, or debug authentication logic

### This Boilerplate Provides:
- **Complete Auth System**: Sign up, sign in, email verification, password reset
- **Multiple Providers**: Google OAuth + Email/Password credentials
- **Production Ready**: Proper error handling, validation, and security measures
- **Type Safe**: Full TypeScript integration with NextAuth.js
- **Modern Stack**: Next.js 15 App Router, Prisma ORM, Tailwind CSS
- **Best Practices**: Follows security and UX best practices

## Features

### Authentication
- **User Registration** with email verification
- **User Sign In** with credentials or Google OAuth
- **Password Reset** with secure token-based flow
- **Email Verification** for new accounts
- **Session Management** with JWT strategy
- **Route Protection** with middleware

### User Experience
- **Responsive Design** with Tailwind CSS
- **Loading States** and proper error handling
- **Form Validation** with Zod schemas
- **Success/Error Messages** for all actions
- **Mobile-First** dashboard layout

### Security
- **Password Hashing** with bcrypt
- **Token Expiration** (1 hour for password reset, 24 hours for email verification)
- **Route Protection** with Next.js middleware
- **Input Validation** and sanitization
- **Secure Session Handling**

### Database
- **Prisma ORM** with MySQL support
- **Type-Safe Queries** and migrations
- **Proper Relationships** between User, Account, and Session models
- **Token Management** for verification and password reset

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Authentication API routes
│   ├── auth/              # Auth pages (signin, register, forgot-password)
│   ├── dashboard/         # Protected dashboard routes
│   └── layout.tsx         # Root layout with auth provider
├── components/            # Reusable UI components
│   ├── auth/             # Authentication forms
│   ├── dashboard/        # Dashboard components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth.js configuration
│   ├── prisma.ts         # Prisma client
│   ├── mail.ts           # Email utilities
│   └── validations/      # Zod validation schemas
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── middleware.ts         # Route protection middleware
```

##  Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL database
- Google OAuth credentials (optional)
- Resend API key for emails

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd nextjs-prisma-auth-boilerplate
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your values:

```bash
# Database
DATABASE_URL="mysql://user:pass@localhost:3306/next_auth_starter"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-strong-random-secret"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Resend (for emails)
RESEND_API_KEY="your_resend_api_key"
EMAIL_FROM="Auth Starter <no-reply@yourdomain.com>"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

##  Usage

### For End Users
1. **Sign Up**: Create account with email verification
2. **Sign In**: Use email/password or Google OAuth
3. **Dashboard**: Access protected content after authentication
4. **Password Reset**: Request reset link if forgotten password

### For Developers
1. **Extend Models**: Add fields to User model in Prisma schema
2. **Add Providers**: Configure additional OAuth providers in `lib/auth.ts`
3. **Custom Pages**: Modify auth pages in `app/auth/` directory
4. **Add Routes**: Create new protected routes in `app/dashboard/`

## Configuration

### Adding New OAuth Providers
```typescript
// lib/auth.ts
import GitHubProvider from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // ... existing providers
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
});
```

### Customizing User Roles
```typescript
// prisma/schema.prisma
model User {
  // ... existing fields
  role String @default("USER") // Can be: USER, ADMIN, MODERATOR
}
```

### Email Templates
Modify email templates in `src/lib/mail.ts` to match your brand.

##  Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Build for production
npm run build
```

##  Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
```

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **Token Expiration**: Configurable expiration times
- **Route Protection**: Middleware-based access control
- **Input Validation**: Zod schema validation
- **Session Security**: JWT with proper configuration
- **CSRF Protection**: Built into NextAuth.js

## Why Choose This Boilerplate?

### **For Startups & MVPs**
- **Save 2-4 weeks** of development time
- **Focus on core features** instead of auth
- **Production-ready** from day one

### **For Enterprise Teams**
- **Security best practices** built-in
- **Scalable architecture** with Prisma
- **Type safety** throughout the stack

### **For Freelancers**
- **Professional quality** authentication
- **Easy customization** for client needs
- **Modern tech stack** that impresses

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Next.js](https://nextjs.org/) - React framework

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/nextjs-prisma-auth-boilerplate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nextjs-prisma-auth-boilerplate/discussions)
- **Email**: your-email@example.com

---

**Built with ❤️ for the Next.js community**

*Star this repository if it helped you build something amazing!*
