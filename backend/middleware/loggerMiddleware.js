/**
 * Request logger middleware for incoming API requests
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const method = req.method;
    const url = req.originalUrl || req.url;

    console.log(`[HTTP] ${method} ${url} ${statusCode} - ${duration}ms`);
  });

  next();
};

export default requestLogger;
