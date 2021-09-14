import React, {useState, useCallback, useEffect, Suspense} from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation'
import Auth from './pages/Auth'
import {AuthContext} from './context/auth-context'
import LoadingSpinner from './components/UIElements/LoadingSpinner'

const Users = React.lazy(() => import('./pages/Users'));
const NewPlace = React.lazy(() => import('./pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./pages/UpdatePlace'));

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false)
    
  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid)
    localStorage.setItem(
      'userData',
      JSON.stringify({userId: uid, token: token})
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token)
    }
  }, [login])

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route exact path="/" component={Users} /> 
        <Route exact path="/:userId/places" component={UserPlaces} /> 
        <Route exact path="/places/new" component={NewPlace} /> 
        <Route exact path="/places/:placeId" component={UpdatePlace} /> 
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/" component={Users} /> 
        <Route exact path="/:userId/places" component={UserPlaces} /> 
        <Route path="/auth" component={Auth} /> 
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout}}>

      <Router>
        <MainNavigation />
          <main> <Suspense fallback={<div className="center"><LoadingSpinner/></div>}>{routes}</Suspense> </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
