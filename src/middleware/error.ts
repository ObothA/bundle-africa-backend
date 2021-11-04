import express, { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.message);
  res.status(err.statusCode ?? 500).json({
    error: err.message || 'Server Error',
  });
};

export default errorHandler;
