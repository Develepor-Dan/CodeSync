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
  console.log('PUT to the database');
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.put({ id: 1, value: content });
  const result = await request;
  console.log('Data saved to the database', result.value);
};

// Getting content from db
export const getDb = async () => {
  console.log('GET from the database');
const jateDb = await openDB('jate', 1);
const tx = jateDb.transaction('jate', 'readonly');
const store = tx.objectStore('jate');
const request = store.get(1);
const result = await request;
result
  ? console.log('Data retrieved from the database', result.value)
  : console.log('Data not found in the database');
return result?.value;
};
initdb();
