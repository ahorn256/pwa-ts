import { Dexie, EntityTable } from 'dexie';
import { Book } from './Book';

export const db = new Dexie('BooksDatabase') as Dexie & {
  books: EntityTable<Book, 'id'>,
};

db.version(1).stores({
  books: '++id',
});
