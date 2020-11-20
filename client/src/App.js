import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import SignIn from './components/SignIn';


import './App.css';

const App = () => {
  return (
    <BrowserRouter>
        <Route exact path = "/">
          <h1>Welcome Nithin</h1>
        </Route>
        <Route exact path = "/signIn">
          <SignIn />
        </Route>
    </BrowserRouter>
  )
}

export default App;
