// Error types
const ErrorType = {
  BAD_TOKEN: 'BadTokenError',
  TOKEN_EXPIRED: 'TokenExpiredError',
  UNAUTHORIZED: 'AuthFailureError',
  INTERNAL: 'InternalServerError',
  NOT_FOUND: 'NotFoundError',
  BAD_REQUEST: 'BadRequestError',
  FORBIDDEN: 'ForbiddenError',
  VALIDATION: 'ValidationError',
};

const ErrorMessage = {
  UNAUTHORIZED: 'Invalid Credentials',
  INTERNAL: 'Internal Server Error',
  BAD_REQUEST: 'Bad Request',
  NOT_FOUND: 'Not Found',
  FORBIDDEN: 'Permission Denied',
  BAD_TOKEN: 'Token Is Not Valid',
  TOKEN_EXPIRED: 'Token Expired',
  VALIDATION: 'Validation Error',
};

/**
 * @class BaseError
 * @param {number} statusCode - HTTP status code
 * @param {boolean} isOperational - Is this error operational
 * @param {string} message - Error message
 * @param {string} type - Error type
 */
class BaseError extends Error {
  constructor(message, statusCode, type, isOperational) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

/**
 * @class ApiError
 */
class ApiError extends BaseError {
  constructor(message, statusCode, type) {
    super(message, statusCode, type, true);
  }
}
/**
 * Check if error is an api specific error
 * @param {Error} err - Error object
 * @returns {boolean} - Is this error an ApiError
 */
export const IsApiError = (err) =>
  err instanceof ApiError ? err.isOperational : false;

//throw Not Found error
export class NotFoundError extends ApiError {
  constructor(message = ErrorMessage.NOT_FOUND, type = ErrorType.NOT_FOUND) {
    super(message, 404, type);
  }
}

//throw Bad Request error
export class BadRequestError extends ApiError {
  constructor(
    message = ErrorMessage.BAD_REQUEST,
    type = ErrorType.BAD_REQUEST
  ) {
    super(message, 400, type);
  }
}
//throw validation error
export class ValidationError extends ApiError {
  constructor(message = ErrorMessage.VALIDATION, type = ErrorType.VALIDATION) {
    super(message, 400, type);
  }
}

//throw Unauthorized error
export class UnauthorizedError extends ApiError {
  constructor(
    message = ErrorMessage.UNAUTHORIZED,
    type = ErrorType.UNAUTHORIZED
  ) {
    super(message, 401, type);
  }
}
//throw Forbidden error
export class ForbiddenError extends ApiError {
  constructor(message = ErrorMessage.FORBIDDEN, type = ErrorType.FORBIDDEN) {
    super(message, 403, type);
  }
}

//throw Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message = ErrorMessage.INTERNAL, type = ErrorType.INTERNAL) {
    super(message, 500, type);
  }
}

//throw Bad Token Error
export class BadTokenError extends ApiError {
  constructor(message = ErrorMessage.BAD_TOKEN, type = ErrorType.BAD_TOKEN) {
    super(message, 401, type);
  }
}

//throw Token Expired Error
export class TokenExpiredError extends ApiError {
  constructor(
    message = ErrorMessage.TOKEN_EXPIRED,
    type = ErrorType.TOKEN_EXPIRED
  ) {
    super(message, 401, type);
  }
}
