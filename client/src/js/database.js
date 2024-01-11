import { openDB } from 'idb';

const initdb = async () =>
  openDB('codesync', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('codesync')) {
        console.log('codesync database already exists');
        return;
      }
      db.createObjectStore('codesync', { keyPath: 'id', autoIncrement: true });
      console.log('codesync database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  const db = await openDB('codesync', 1);
  const tx = db.transaction('codesync', 'readwrite');
  const store = tx.objectStore('codesync');

  await store.add({ content });
  console.log('Content added to the codesync database');
};
// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const db = await openDB('codesync', 1);
  const tx = db.transaction('codesync', 'readonly');
  const store = tx.objectStore('codesync');

  return store.getAll();
};
initdb();
