import { Router } from 'express';
import {
  getTrackedRepos,
  getRepoDetails,
  trackRepo,
  untrackRepo,
  syncRepo
} from '../controllers/repoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All repo routes require authentication
router.use(protect);

router.get('/', getTrackedRepos);
router.post('/', trackRepo);
router.get('/:id', getRepoDetails);
router.delete('/:id', untrackRepo);
router.post('/:id/sync', syncRepo);

export default router;

