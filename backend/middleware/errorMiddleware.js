import { sendError } from '../util/apiResponse.js';

/**
 * Handle 404 Route Not Found
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isDev = process.env.NODE_ENV !== 'production';

  return sendError(
    res,
    err.message || 'Server Internal Error',
    statusCode,
    isDev ? { stack: err.stack } : null
  );
};

export default { notFound, errorHandler };

