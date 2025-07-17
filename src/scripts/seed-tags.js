// scripts/seed-tags.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tag from '../models/Tag.js'; // Adjust path as needed

dotenv.config(); // Load MONGODB_URI from .env

const tags = [
  'javascript', 'python', 'java', 'c#', 'php', 'c++', 'typescript', 'ruby',
  'swift', 'kotlin', 'go', 'rust', 'react', 'angular', 'vue.js', 'node.js',
  'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'mongodb',
  'mysql', 'postgresql', 'sql', 'html', 'css', 'next.js', 'nuxt.js', 'svelte',
  'tailwindcss', 'bootstrap', 'graphql', 'rest', 'api', 'webdev',
  'fullstack', 'frontend', 'backend', 'devops', 'docker', 'kubernetes',
  'aws', 'azure', 'firebase', 'jest', 'cypress', 'testing', 'vscode'
];

async function seedTags() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'stacklite',
    });

    await Tag.deleteMany({}); // Optional: clear existing tags
    const inserted = await Tag.insertMany(tags.map(name => ({ name })));

    console.log(`✅ Inserted ${inserted.length} tags.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedTags();
