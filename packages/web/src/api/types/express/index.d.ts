import express from "express";

export interface AuthUser {
  userId: number;
  twitterId: string;
}

declare global {
  namespace Express {
    interface User extends AuthUser { }

    interface Request {
      user?: User;
    }
  }
}