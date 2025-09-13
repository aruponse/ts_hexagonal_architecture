import { Request, Response, NextFunction } from 'express';
import { DomainException } from '@/domain/exceptions/domain.exception';
import { ValidationException } from '@/domain/exceptions/validation.exception';

export interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  field?: string;
  timestamp: string;
  path: string;
}

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error details only in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error caught by middleware:', err);
  } else {
    console.error('Error caught by middleware:', err.message);
  }

  let statusCode = 500;
  let errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  if (err instanceof DomainException) {
    statusCode = getStatusCodeForDomainException(err);
    errorResponse = {
      error: err.name,
      message: err.message,
      code: err.code,
      timestamp: new Date().toISOString(),
      path: req.path,
    };
  } else if (err instanceof ValidationException) {
    statusCode = 400;
    errorResponse = {
      error: err.name,
      message: err.message,
      field: err.field,
      timestamp: new Date().toISOString(),
      path: req.path,
    };
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse = {
      error: 'Validation Error',
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.path,
    };
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorResponse = {
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
      timestamp: new Date().toISOString(),
      path: req.path,
    };
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorResponse = {
      error: 'Forbidden',
      message: 'Access denied',
      timestamp: new Date().toISOString(),
      path: req.path,
    };
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorResponse = {
      error: 'Not Found',
      message: err.message || 'Resource not found',
      timestamp: new Date().toISOString(),
      path: req.path,
    };
  }

  res.status(statusCode).json(errorResponse);
};

function getStatusCodeForDomainException(err: DomainException): number {
  switch (err.code) {
    case 'USER_NOT_FOUND':
      return 404;
    case 'USER_ALREADY_EXISTS':
      return 409;
    case 'INVALID_CREDENTIALS':
      return 401;
    case 'USER_DEACTIVATED':
      return 403;
    case 'INSUFFICIENT_PERMISSIONS':
      return 403;
    case 'ROLE_NOT_FOUND':
      return 404;
    default:
      return 400;
  }
}