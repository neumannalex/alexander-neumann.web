import React, { Component, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  Icon,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import './App.css';

import { authenticationService } from './services/authenticationService';
import { history } from './helpers/history';

import {PrivateRoute} from './components/PrivateRoute/PrivateRoute';
import {ResponsiveContainer} from './AppLayout';
import {Footer} from './components/Footer/Footer';
import {LoginForm} from './components/LoginForm/LoginForm';
import {SignupForm} from './components/SignupForm/SignupForm';

import {NotFound} from './components/NotFound/NotFound';
import {IndexPage} from './pages/IndexPage';
import {HomePage} from './pages/HomePage';
import {GalleryPage} from './pages/GalleryPage';
import {PrivacyPage} from './pages/PrivacyPage';
import {UserList} from './pages/admin/UserList';
import {GalleryList} from './pages/admin/GalleryList';

function App() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    authenticationService.currentUser.subscribe(user => setCurrentUser(user));
  });

  return (
    <Router history={history}>
      <ResponsiveContainer className="site" footerHeight="140px">
        <Container id="main-content" fluid style={{ marginTop: "7em", marginBottom: "2em", paddingLeft: "2em", paddingRight: "2em", minHeight: "calc(100vh - 9em - 140px)" }}>
          <Switch>
          <Route exact path="/" component={IndexPage} />
          <Route path="/home" component={HomePage} />
          <PrivateRoute path="/gallery" roles={['Member']} component={GalleryPage} />

          <PrivateRoute path="/admin/users" roles={['Admin']} component={UserList} />
          <PrivateRoute path="/admin/galleries" roles={['Admin']} component={GalleryList} />

          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/login" component={LoginForm} />
          <Route path="/signup" component={SignupForm} />
          <Route component={NotFound} />
          {/* <Route exact path="/" component={IndexPage} /> */}
          </Switch>
        </Container>
      </ResponsiveContainer>
    </Router>
  );
}

export default App;
