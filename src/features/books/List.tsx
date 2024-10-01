import React, { useMemo, useState } from "react";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { Delete, Edit, Star, StarBorder } from "@mui/icons-material";
import { Book, BookSort, BookSortIn } from "./Book";
import { useNavigate } from "react-router-dom";
import { filterBooks, sortBooks } from "./booksHelpers";
import ErrorMessage from "../../ErrorMessage";
import { IFetchError } from "../../FetchError";

type Props = {
  filterByTitle?: string,
}

const tableHead = {
  title: 'Title',
  author: 'Author',
  isbn: 'ISBN',
  rating: 'Bewertung',
};

const initialBooks = [
  {
    "id": "1",
    "title": "JavaScript - das umfassende Handbuch",
    "author": "Philip Ackermann",
    "isbn": "978-3836286299",
    "rating": 5
  },
  {
    "id": "2",
    "title": "Clean Code",
    "author": "Robert Martin",
    "isbn": "978-0132350884",
    "rating": 4
  },
  {
    "id": "3",
    "title": "Design Patterns",
    "author": "Erich Gamma",
    "isbn": "978-0201633610",
    "rating": 5
  }
];

const List:React.FC<Props> = ({ filterByTitle }) => {
  const [ sort, setSort ] = useState<BookSort>({
    orderBy: 'title',
    order: 'asc',
  });
  const navigate = useNavigate();

  const [ books ] = useState<Book[]|null>(initialBooks);
  const [ isPending ] = useState(false);
  const [ error ] = useState<IFetchError|null>(null);

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
