import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { AirtableAdapter } from '@auth/airtable-adapter';

export const authOptions = {
  providers: [
    // Email Magic Links
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // GitHub OAuth (optional)
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: AirtableAdapter({
    baseId: process.env.AIRTABLE_BASE_ID,
    apiKey: process.env.AIRTABLE_TOKEN,
    // Tables will be created automatically if they don't exist
    tableNames: {
      User: 'Users',
      Account: 'Accounts',
      Session: 'Sessions',
      VerificationToken: 'VerificationTokens',
    },
  }),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      if (token?.sub) {
        session.user.id = token.sub;
      }
      // Add custom user data
      if (token?.clientId) {
        session.user.clientId = token.clientId;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add custom claims to token
      if (user) {
        token.clientId = user.clientId || 'shared';
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
};

export default NextAuth(authOptions);
