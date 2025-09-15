import app, { createApp } from './app.js';

// Prefer PORT from env with fallback
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Allow overriding app creation for future dependency injection
const instance = app ?? createApp();

instance.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
