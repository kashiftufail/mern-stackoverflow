// lib/agenda.js
import { Agenda } from 'agenda';
import { connectDB } from './mongoose'; // Your MongoDB connection helper

const mongoConnectionString = process.env.MONGODB_URI;
const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'jobs' } });

export default agenda;
