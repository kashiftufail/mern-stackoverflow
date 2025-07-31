// src/jobs/sendNewAnswerNotification.js
import nodemailer from 'nodemailer';

export default function defineSendNewAnswerNotification(agenda) {
  agenda.define('send answer notification', async (job) => {
    const { questionOwnerEmail, questionTitle, answerBody } = job.attrs.data;

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

    console.log('✅ Sent answer notification email to', questionOwnerEmail);
  });
}
