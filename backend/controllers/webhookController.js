import Commit from '../schema/Commit.js';
import Repository from '../schema/Repository.js';
import { sendSuccess } from '../util/apiResponse.js';
import { asyncHandler } from '../util/asyncHandler.js';

/**
 * @desc    Receive GitHub webhook events
 * @route   POST /api/webhooks/github
 * @access  Public (Validated with GitHub Secret/Header)
 */
export const handleGithubWebhook = asyncHandler(async (req, res) => {
  const event = req.headers['x-github-event'] || 'ping';
  const payload = req.body;

  console.log(`[Webhook] Received GitHub event: ${event}`);

  if (event === 'ping') {
    return sendSuccess(res, { zen: payload.zen }, 'GitHub ping acknowledged');
  }

  if (event === 'push' && payload.repository) {
    const fullName = payload.repository.full_name;
    const trackedRepo = await Repository.findOne({ fullName });

    if (trackedRepo && Array.isArray(payload.commits)) {
      const commitDocs = payload.commits.map((c) => ({
        repository: trackedRepo._id,
        commitHash: c.id,
        message: c.message,
        authorName: c.author?.name || 'Unknown',
        authorEmail: c.author?.email || '',
        authorDate: c.timestamp ? new Date(c.timestamp) : new Date(),
        url: c.url || '',
        additions: (c.added?.length || 0) + (c.modified?.length || 0),
        deletions: c.removed?.length || 0
      }));

      // Ingest commits ignoring duplicates
      for (const doc of commitDocs) {
        await Commit.updateOne(
          { repository: doc.repository, commitHash: doc.commitHash },
          { $set: doc },
          { upsert: true }
        );
      }

      trackedRepo.lastSyncedAt = new Date();
      await trackedRepo.save();
    }
  }

  return sendSuccess(res, { event, processed: true }, 'Webhook processed successfully');
});

export default {
  handleGithubWebhook
};
