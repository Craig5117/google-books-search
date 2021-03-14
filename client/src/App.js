import React, { useState } from 'react';
import Auth from './utils/auth'
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import LoginFirst from './pages/LoginFirst';


const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem('id_token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
  uri: '/graphql',
});

function App() {
  const [showModal, setShowModal] = useState(false);
  const loggedIn = Auth.loggedIn();
  console.log(loggedIn)
  // Maybe could add useState for loggedIn to toggle save book buttons
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar showModal={showModal} setShowModal={setShowModal}/>
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            {loggedIn ? (<Route exact path="/saved" component={SavedBooks} />) : 
            (<Route exact path="/saved" component={LoginFirst}/>)}
            
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
