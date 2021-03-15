import React, {useState} from 'react';
import {
  Jumbotron,
  Container,
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useHistory } from 'react-router-dom';
import Booklist from '../components/Booklist'

const SavedBooks = () => {
  // get My data
  const { loading, data } = useQuery(QUERY_ME);
  const history = useHistory();
  const [userData, setUserData] = useState({});
  if (data.me) {
    setUserData(data.me)
  }
  const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, savedBooks: [...me.savedBooks, removeBook] } },
      });
    },
  });

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
      console.log(bookId);
      if (error) {
        throw new Error('something went wrong!');
      }
      removeBookId(bookId);
      console.log(updatedData);

      history.go(0);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      {data?.me  ( <Container>
     <h2>
          {data.me.savedBooks.length
            ? `Viewing ${data.me.savedBooks.length} saved ${
                data.me.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Booklist userData={userData} handleDeleteBook={handleDeleteBook}/>
      </Container>)}
    </>
  );
};

export default SavedBooks;
