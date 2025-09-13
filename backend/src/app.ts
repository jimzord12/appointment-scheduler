import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
// Use dynamic import for helmet to avoid type resolution issues if types not installed
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import helmet from 'helmet';

// Load environment variables
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

// ESM direct execution detection
// if (import.meta.url === `file://${process.argv[1]}`) {
//   app.listen(PORT, () => {
//     console.log(`Backend server running on port ${PORT}`);
//   });
// }

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;

