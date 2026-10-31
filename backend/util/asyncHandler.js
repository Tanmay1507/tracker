/**
 * Async handler to wrap express controllers and catch unhandled promise rejections
 * @param {Function} fn - Async controller function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
