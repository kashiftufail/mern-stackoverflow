// src/lib/agenda.js
import { Agenda } from 'agenda';
import nodemailer from 'nodemailer';

import defineSendNewAnswerNotification from '../jobs/sendNewAnswerNotification.js';
const mongoConnectionString = process.env.MONGODB_URI;

const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: 'agendaJobs' },
  processEvery: '30 seconds',
});

defineSendNewAnswerNotification(agenda);

const ready = new Promise((resolve) => {
  agenda.once('ready', () => {
    console.log('✅ Agenda is ready!');
    resolve();
  });
});

export { agenda, ready };
