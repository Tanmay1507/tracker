import User from '../schema/User.js';
import { hashPassword, comparePassword, generateToken } from '../util/auth.js';
import { sendSuccess, sendError } from '../util/apiResponse.js';
import { asyncHandler } from '../util/asyncHandler.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, githubUsername } = req.body;

  if (!username || !email || !password) {
    return sendError(res, 'Username, email, and password are required', 400);
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return sendError(res, 'User with that email or username already exists', 400);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    githubUsername: githubUsername || null
  });

  const token = generateToken({ id: newUser._id });

  return sendSuccess(
    res,
    {
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        githubUsername: newUser.githubUsername
      },
      token
    },
    'User registered successfully',
    201
  );
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const token = generateToken({ id: user._id });

  return sendSuccess(
    res,
    {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        githubUsername: user.githubUsername,
        avatarUrl: user.avatarUrl
      },
      token
    },
    'Login successful'
  );
});

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user }, 'Current user profile retrieved');
});

export default {
  registerUser,
  loginUser,
  getCurrentUser
};

