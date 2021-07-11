import { Request } from 'express';

export const fullUrl = (req: Request): string => {
  const host = req.get('host') || '';
  const { protocol, originalUrl } = req;

  return `${protocol}://${host}${originalUrl}`;
};
