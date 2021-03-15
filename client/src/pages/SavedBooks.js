import React, {useState} from 'react';
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';


const SavedBooks = () => {
  // get My data
  const [userData, setUserData] = useState({});
  const { data } = useQuery(QUERY_ME,
    {onCompleted: () => {
      setUserData(data.me)
    }});
 
 
  const userDataLength = Object.keys(userData).length;
 
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const updatedData = await removeBook({
        variables: { bookId: bookId },
      });
      // console.log(bookId);
      if (error) {
        throw new Error('something went wrong!');
      }
      setUserData(updatedData.data.removeBook);
      removeBookId(bookId);
      

    } catch (err) {
      console.error(err);
    }
  };
  const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return (
        <h2>Please login first</h2>
      );
    }
  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  } 

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userDataLength
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
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
      </Container>
    </>
  );
};

export default SavedBooks;
