import React from 'react';
import { CardColumns, Card, Button } from 'react-bootstrap';

const Booklist = (props) => {
    const {userData, handleDeleteBook} = props;

    return (
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  {book.link && (
                    <Card.Link href={book.link}>
                      See it on Google Books
                    </Card.Link>
                  )}
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
    )
}

export default Booklist;