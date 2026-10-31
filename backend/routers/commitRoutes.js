import { Router } from 'express';
import { getRepoCommits, getCommitStats } from '../controllers/commitController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All commit routes require authentication
router.use(protect);

router.get('/stats', getCommitStats);
router.get('/repo/:repoId', getRepoCommits);

export default router;
