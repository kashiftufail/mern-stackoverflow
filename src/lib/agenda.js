// src/lib/agenda.js
import { Agenda } from 'agenda';
import nodemailer from 'nodemailer';

import defineSendAnswerJob from '../jobs/sendNewAnswerNotification.js';
const mongoConnectionString = process.env.MONGODB_URI;

const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: 'agendaJobs' },
  processEvery: '30 seconds',
});

agenda.define('send answer notification', async (job) => {
  const { questionOwnerEmail, answerBody, questionTitle } = job.attrs.data;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: questionOwnerEmail,
    subject: `New Answer on: ${questionTitle}`,
    text: `Your question "${questionTitle}" has a new answer:\n\n${answerBody}`,
  });




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
