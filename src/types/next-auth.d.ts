// src/types/next-auth.d.ts
import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'customer' | 'admin';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'customer' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: 'customer' | 'admin';
  }
}
