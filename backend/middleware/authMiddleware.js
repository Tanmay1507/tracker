import { verifyToken } from '../util/auth.js';
import User from '../schema/User.js';
import { sendError } from '../util/apiResponse.js';

/**
 * Protect routes by validating JWT Bearer token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Not authorized, no token provided', 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 'User not found for this token', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized, invalid token', 401, error.message);
  }
};

export default { protect };
