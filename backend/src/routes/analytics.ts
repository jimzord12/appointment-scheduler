import { Request, Response, Router } from 'express';

const analyticsRouter = Router();

analyticsRouter.get('/health', async (_req: Request, res: Response) => {
  // Gather non-sensitive runtime metadata for health checks / diagnostics.
  // Intentionally avoid sending full process.env to prevent leaking secrets.
  const os = await import('os');
  const memory = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  const details = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    startedAt: new Date(Date.now() - uptimeSeconds * 1000).toISOString(),
    pid: process.pid,
    nodeVersion: process.version,
    env: process.env.NODE_ENV ?? 'development',
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external,
    },
    loadavg: typeof os.loadavg === 'function' ? os.loadavg() : [],
    cpus: os.cpus().length,
    platform: os.platform(),
  };

  const metadata = {
    appName: process.env.APP_NAME ?? null,
    version: process.env.VERSION ?? process.env.npm_package_version ?? null,
    commitSha: process.env.COMMIT_SHA ?? null,
  };

  res.status(200).json({ details, metadata });
});

export default analyticsRouter;
