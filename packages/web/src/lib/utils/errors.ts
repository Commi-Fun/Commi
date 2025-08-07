export class BadRequestError extends Error {
  name = 'BadRequestError';
  status = 400;
  
  constructor(message: string = 'BadRequest') {
    super(message);
  }
} 

export class UnauthorizedError extends Error {
  name = 'UnauthorizedError';
  status = 401;
  
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends Error {
  name = 'ForbiddenError';
  status = 403;
  
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  name = 'NotFoundError';
  status = 404;
  
  constructor(message: string = 'Resource not found') {
    super(message);
  }
}

export class DatabaseError extends Error {
  name = 'DatabaseError';
  status = 500;
  
  constructor(message: string = 'Database operation failed') {
    super(message);
  }
}

export class ServiceError extends Error {
  name = 'ServiceError';
  status = 500;
  
  constructor(message: string = 'Service operation failed') {
    super(message);
  }
} 