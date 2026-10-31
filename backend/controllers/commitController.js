import Commit from '../schema/Commit.js';
import Repository from '../schema/Repository.js';
import { sendSuccess, sendError } from '../util/apiResponse.js';
import { asyncHandler } from '../util/asyncHandler.js';

/**
 * @desc    Get commits for a specific repository
 * @route   GET /api/commits/repo/:repoId
 * @access  Private
 */
export const getRepoCommits = asyncHandler(async (req, res) => {
  const { repoId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  // Verify repository belongs to user
  const repo = await Repository.findOne({ _id: repoId, user: req.user._id });
  if (!repo) {
    return sendError(res, 'Repository not found or access denied', 404);
  }

  const [commits, total] = await Promise.all([
    Commit.find({ repository: repoId })
      .sort({ authorDate: -1 })
      .skip(skip)
      .limit(limit),
    Commit.countDocuments({ repository: repoId })
  ]);

  return sendSuccess(
    res,
    {
      commits,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    },
    'Commits retrieved'
  );
});

/**
 * @desc    Get commit stats & activity summary for user
 * @route   GET /api/commits/stats
 * @access  Private
 */
export const getCommitStats = asyncHandler(async (req, res) => {
  const userRepos = await Repository.find({ user: req.user._id }).select('_id');
  const repoIds = userRepos.map((r) => r._id);

  const totalCommits = await Commit.countDocuments({ repository: { $in: repoIds } });

  // Aggregation for additions/deletions
  const stats = await Commit.aggregate([
    { $match: { repository: { $in: repoIds } } },
    {
      $group: {
        _id: null,
        totalAdditions: { $sum: '$additions' },
        totalDeletions: { $sum: '$deletions' }
      }
    }
  ]);

  const summary = {
    totalTrackedRepos: userRepos.length,
    totalCommits,
    totalAdditions: stats[0]?.totalAdditions || 0,
    totalDeletions: stats[0]?.totalDeletions || 0
  };

  return sendSuccess(res, { stats: summary }, 'Commit statistics calculated');
});

export default {
  getRepoCommits,
  getCommitStats
};
