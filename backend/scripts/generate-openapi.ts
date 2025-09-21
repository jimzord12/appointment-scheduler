import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildOpenApiSpec } from '../src/openapi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const doc = buildOpenApiSpec();
  const outPath = resolve(__dirname, '..', 'openapi.json');
  writeFileSync(outPath, JSON.stringify(doc, null, 2), 'utf-8');
  console.log(`OpenAPI spec written to ${outPath}`);
}

main().catch(err => {
  console.error('Failed to generate OpenAPI spec:', err);
  process.exit(1);
});
