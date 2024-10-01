import React, { useEffect, useMemo, useState } from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Delete, Edit, Star, StarBorder } from "@mui/icons-material";
import { Book, BookSort, BookSortIn } from "./Book";
import { useNavigate } from "react-router-dom";
import { filterBooks, sortBooks } from "./booksHelpers";
import ErrorMessage from "../../ErrorMessage";
import { convertToFetchError, IFetchError } from "../../FetchError";
import { fetchBooks } from "./booksAPI";
import { db } from "./booksDB";

type Props = {
  filterByTitle?: string,
}

const tableHead = {
  title: 'Title',
  author: 'Author',
  isbn: 'ISBN',
  rating: 'Bewertung',
};

const List:React.FC<Props> = ({ filterByTitle }) => {
  const [ sort, setSort ] = useState<BookSort>({
    orderBy: 'title',
    order: 'asc',
  });
  const navigate = useNavigate();

  const [ books, setBooks ] = useState<Book[]|null>([]);
  const [ isPending, setIsPending ] = useState(false);
  const [ error, setError ] = useState<IFetchError|null>(null);

  useEffect(() => {(async () => {
    let data:Book[] = [];

    try {
      setIsPending(true);
      setError(null);
      data = await fetchBooks();
      db.books.clear();
      db.books.bulkAdd(data);
    } catch(err) {
      const fetchErr = convertToFetchError(err);

      // offline mode
      if(!fetchErr.status) {
        data = await db.books.toArray();
        setError({ message: `Failed to fetch - Show cached data` });
      } else {
        setError(fetchErr);
      }
    } finally {
      setIsPending(false);
    }

    setBooks(data);
  })()}, []);

  const filteredBooks = useMemo<Book[]>(() =>
    books ? sortBooks(
      filterByTitle ?
        filterBooks(books, filterByTitle) :
        books, sort) : [],
    [sort, books, filterByTitle]);
  
  function onDelete(book:Book) {
    navigate(`/delete/${book.id}`);
  }

  function onEdit(book:Book) {
    navigate(`/edit/${book.id}`);
  }

  return (
    <Paper>
      {isPending && <p>loading...</p>}
      {error && <ErrorMessage error={{message: error.message}}/> }
      <Table>
        <TableHead>
          <TableRow>
            {Object.entries(tableHead).map(([key, head]) => (
              <TableCell key={key}>
                {head}
                <TableSortLabel
                  active={sort.orderBy === head}
                  direction={sort.order}
                  onClick={() => {
                    setSort({
                      orderBy: key as BookSortIn,
                      order: sort.order === 'asc' ? 'desc' : 'asc'
                    });
                  }} />
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBooks.map(book => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{Array(5).fill(0).map((item, index) => index < book.rating ? <Star key={index} /> : <StarBorder key={index} />)}</TableCell>
              <TableCell>
                <IconButton aria-label="edit book" onClick={() => onEdit(book)}>
                  <Edit />
                </IconButton>
                <IconButton aria-label="delete book" onClick={() => onDelete(book)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default List;
