import { Router } from 'express';
import authRoutes from './authRoutes.js';
import repoRoutes from './repoRoutes.js';
import commitRoutes from './commitRoutes.js';
import webhookRoutes from './webhookRoutes.js';

const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Git Tracker API'
  });
});

// Mount modular sub-routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/repos', repoRoutes);
apiRouter.use('/commits', commitRoutes);
apiRouter.use('/webhooks', webhookRoutes);

export default apiRouter;

