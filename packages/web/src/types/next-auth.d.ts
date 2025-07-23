// /frontend/src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

/**
 * Module augmentation for 'next-auth'.
 * Allows us to add custom properties to the session object
 * and keep type safety.
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module 'next-auth' {
  interface Session {
    address?: string; // For Ethereum wallet address
    user: {
      id: string;
      username?: string; // For X username
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    username?: string;
  }
}