import 'express';

declare module 'express' {
  interface Request {
    user?: {
      userId: string;
      [key: string]: any; // Allow for additional dynamic properties
    };
  }
}