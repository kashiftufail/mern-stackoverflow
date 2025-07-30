import agenda from './agenda';

let started = false;

export const startAgenda = async () => {
  if (!started) {
    await agenda.start(); // ✅ This is missing in your current setup
    started = true;
    console.log('🚀 Agenda started from API route');
  }
};
