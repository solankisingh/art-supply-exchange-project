import { readData, writeData, files } from './db.js';

export const seedDatabase = async () => {
  // Fresh initialization without hardcoded fake/test seed data
  // The system starts clean for real users to register and post real items.
  const users = readData(files.USERS_FILE, null);
  if (!users) {
    writeData(files.USERS_FILE, []);
  }

  const items = readData(files.ITEMS_FILE, null);
  if (!items) {
    writeData(files.ITEMS_FILE, []);
  }

  const swaps = readData(files.SWAPS_FILE, null);
  if (!swaps) {
    writeData(files.SWAPS_FILE, []);
  }

  const messages = readData(files.MESSAGES_FILE, null);
  if (!messages) {
    writeData(files.MESSAGES_FILE, []);
  }
};
