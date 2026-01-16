/**
 * Custom exceptions raised by the luminox TypeScript client.
 */

/**
 * Base exception for all errors raised by `luminox`.
 */
export class LuminoxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LuminoxError';
    Object.setPrototypeOf(this, LuminoxError.prototype);
  }
}

/**
 * Raised when the server returns an error response.
 */
export class APIError extends LuminoxError {
  statusCode: number;
  code?: number;
  message: string;
  error?: string;
  payload?: unknown;

  constructor(options: {
    statusCode: number;
    code?: number;
    message?: string;
    error?: string;
    payload?: unknown;
  }) {
    const details = options.message || options.error || 'API request failed';
    super(`${options.statusCode}: ${details}`);
    this.name = 'APIError';
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.message = details;
    this.error = options.error;
    this.payload = options.payload;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * Raised when the underlying HTTP transport failed before receiving a response.
 */
export class TransportError extends LuminoxError {
  constructor(message: string) {
    super(message);
    this.name = 'TransportError';
    Object.setPrototypeOf(this, TransportError.prototype);
  }
}

