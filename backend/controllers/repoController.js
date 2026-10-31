import Repository from '../schema/Repository.js';
import Commit from '../schema/Commit.js';
import { sendSuccess, sendError } from '../util/apiResponse.js';
import { asyncHandler } from '../util/asyncHandler.js';

/**
 * @desc    Get all tracked repositories for current user
 * @route   GET /api/repos
 * @access  Private
 */
export const getTrackedRepos = asyncHandler(async (req, res) => {
  const repos = await Repository.find({ user: req.user._id }).sort({ updatedAt: -1 });
  return sendSuccess(res, { repos }, 'Tracked repositories retrieved');
});

/**
 * @desc    Get repository details by ID
 * @route   GET /api/repos/:id
 * @access  Private
 */
export const getRepoDetails = asyncHandler(async (req, res) => {
  const repo = await Repository.findOne({ _id: req.params.id, user: req.user._id });

  if (!repo) {
    return sendError(res, 'Repository not found', 404);
  }

  const latestCommits = await Commit.find({ repository: repo._id })
    .sort({ authorDate: -1 })
    .limit(10);

  return sendSuccess(res, { repo, latestCommits }, 'Repository details retrieved');
});

/**
 * @desc    Track a new repository
 * @route   POST /api/repos
 * @access  Private
 */
export const trackRepo = asyncHandler(async (req, res) => {
  const { name, owner, fullName, description, url, isPrivate, defaultBranch } = req.body;

  if (!name || !owner || !fullName || !url) {
    return sendError(res, 'Repository name, owner, fullName, and url are required', 400);
  }

  const existing = await Repository.findOne({ user: req.user._id, fullName });
  if (existing) {
    return sendError(res, 'This repository is already being tracked', 409);
  }

  const newRepo = await Repository.create({
    user: req.user._id,
    name,
    owner,
    fullName,
    description: description || '',
    url,
    isPrivate: Boolean(isPrivate),
    defaultBranch: defaultBranch || 'main',
    lastSyncedAt: new Date()
  });

  return sendSuccess(res, { repo: newRepo }, 'Repository tracked successfully', 201);
});

/**
 * @desc    Untrack / delete a repository
 * @route   DELETE /api/repos/:id
 * @access  Private
 */
export const untrackRepo = asyncHandler(async (req, res) => {
  const repo = await Repository.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!repo) {
    return sendError(res, 'Repository not found', 404);
  }

  // Also remove associated commits
  await Commit.deleteMany({ repository: repo._id });

  return sendSuccess(res, null, 'Repository removed from tracking');
});

/**
 * @desc    Trigger sync for a repository
 * @route   POST /api/repos/:id/sync
 * @access  Private
 */
export const syncRepo = asyncHandler(async (req, res) => {
  const repo = await Repository.findOne({ _id: req.params.id, user: req.user._id });

  if (!repo) {
    return sendError(res, 'Repository not found', 404);
  }

  repo.lastSyncedAt = new Date();
  await repo.save();

  return sendSuccess(res, { repo }, 'Repository sync initiated');
});

export default {
  getTrackedRepos,
  getRepoDetails,
  trackRepo,
  untrackRepo,
  syncRepo
};
