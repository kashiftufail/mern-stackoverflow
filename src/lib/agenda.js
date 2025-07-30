// src/lib/agenda.js
import { Agenda } from 'agenda';

const mongoConnectionString = process.env.MONGODB_URI;

const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: 'agendaJobs' },
  processEvery: '30 seconds',
});

agenda.define('send answer notification', async (job) => {
  const { questionOwnerEmail, answerBody, questionTitle } = job.attrs.data;
  console.log('📩 Sending email to:', questionOwnerEmail);
  console.log(`Question: ${questionTitle}`);
  console.log(`Answer: ${answerBody}`);
});

const ready = new Promise((resolve) => {
  agenda.once('ready', () => {
    console.log('✅ Agenda is ready!');
    resolve();
  });
});

export { agenda, ready };
