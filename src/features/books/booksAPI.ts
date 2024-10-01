import { FetchError } from "../../FetchError";
import { Book, InputBook } from "./Book";

export async function fetchBooks():Promise<Book[]> {
  const url = process.env.REACT_APP_BACKEND_BOOKS_URL;

  if(!url) throw new Error('REACT_APP_BACKEND_BOOKS_URL undefined');
  
  const response = await fetch(url);

  if(response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new FetchError(`Couldn't fetch books`, response.status);
  }
};

export async function deleteBook(id: string) {
  const url = process.env.REACT_APP_BACKEND_BOOKS_URL;

  if(!url) throw new Error('REACT_APP_BACKEND_BOOKS_URL undefined');

  const response = await fetch(`${url}/${id}`, {
    method: 'DELETE',
  });

  if(response.ok) {
    return id;
  } else {
    throw new FetchError(`Couldn't delete the book with the id "${id}".`, response.status);
  }
}

export async function saveBook(book: InputBook):Promise<Book> {
  const url = process.env.REACT_APP_BACKEND_BOOKS_URL;
  if(!url) throw new Error('REACT_APP_BACKEND_BOOKS_URL undefined');

  const hasId = 'id' in book;
  const method = hasId ? 'PUT' : 'POST';
  const fetchUrl = hasId ? `${url}/${book.id}` : url;

  const response = await fetch(fetchUrl, {
    method,
    body: JSON.stringify(book),
    headers: { 'content-type': 'application/json' },
  });
  
  if(response.ok) {
    return await response.json();
  } else {
    throw new FetchError(`Couldn't save the book "${book.title}"`, response.status);
  }
}
