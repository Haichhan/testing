import { PrismaClient } from "@prisma/client";
import express from 'express';

let prisma: PrismaClient | null = null;
export const getPrismaInstant = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export const measureTime = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const start = Date.now();
  res.on('finish', () => {
    const end = Date.now();
    const duration = end - start;
    console.log(`[${req.method}] ${req.url} took ${duration}ms`);
  });
  next();
};