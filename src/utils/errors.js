export default class errMessages extends Error {
  status;
  isOperational;

  constructor(message, statusCode = 500) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
