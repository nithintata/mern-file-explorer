import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import SignIn from './components/SignIn';
import './App.css';
import Layout from './components/Layout';
import Search from './components/Search';

const MyRouter = () => {
  /*const history = useHistory();
  useEffect(() => {
    const { token } = JSON.parse(localStorage.getItem('jwt'));
    if (!token) {
      history.push('/signIn');
    }
  }, []);*/

  return (
    <Switch>
      <Route exact path="/signIn">
        <SignIn />
      </Route>
      <Route exact path = "/search">
        <Search />
      </Route>
      <Route component = {Layout} />
    </Switch>
  )
}
const App = () => {
  return (
    <BrowserRouter>
        <MyRouter />
    </BrowserRouter>
  )
}

export default App;
