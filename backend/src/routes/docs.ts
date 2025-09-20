import { Router } from 'express';

import { buildOpenApiSpec } from '../openapi.js';

const docsRouter = Router();

docsRouter.get('/openapi.json', (_req, res) => {
  const spec = buildOpenApiSpec();
  res.status(200).json(spec);
});

export default docsRouter;
