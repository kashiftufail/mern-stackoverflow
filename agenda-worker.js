// agenda-worker.js
import 'dotenv/config'; // Loads .env automatically

import { connectDB } from './src/lib/mongoose.js';
import { agenda } from './src/lib/agenda.js';

const run = async () => {
  await connectDB();
  await agenda.start();
  console.log('🚀 Agenda worker started...');
};

run().catch((err) => {
  console.error('❌ Agenda worker failed:', err);
});
