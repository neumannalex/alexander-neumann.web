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
import authAxios from './helpers/authAxios';

import {PrivateRoute} from './components/PrivateRoute/PrivateRoute';
import {ResponsiveContainer} from './AppLayout';
import {Footer} from './components/Footer/Footer';
import {LoginForm} from './components/Account/LoginForm/LoginForm';
import {SignupForm} from './components/Account/SignupForm/SignupForm';
import {ConfirmSignup} from './components/Account/SignupForm/ConfirmSignup';
import {ForgotPasswordForm} from './components/Account/ForgotPasswordForm/ForgotPasswordForm';
import {ResetPassword} from './components/Account/ForgotPasswordForm/ResetPassword';
import {ChangePasswordForm} from './components/Account/ChangePassword/ChangePasswordForm';

import {NotFound} from './components/NotFound/NotFound';
import {IndexPage} from './pages/IndexPage';
import {HomePage} from './pages/HomePage';
import {GalleryPage} from './pages/GalleryPage';
import {PrivacyPage} from './pages/PrivacyPage';
import {UserList} from './pages/admin/UserList';
import {GalleryList} from './pages/admin/GalleryList';
import {ValuesPage} from './pages/Values';
import {ProfilePage} from './pages/ProfilePage';

function App() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    authenticationService.currentUser.subscribe(user => setCurrentUser(user));
  });

  return (
    <Router history={history}>
      <ResponsiveContainer className="site" footerHeight="70px">
        <Container id="main-content" fluid style={{ marginTop: "7em", marginBottom: "2em", paddingLeft: "2em", paddingRight: "2em", minHeight: "calc(100vh - 9em - 70px)" }}>
          <Switch>
            <Route exact path="/" component={IndexPage} />
            <Route path="/home" component={HomePage} />
            <PrivateRoute path="/gallery" roles={['Member','Manager','Admin']} component={GalleryPage} />
            <PrivateRoute path="/values" roles={['Member','Manager','Admin']} component={ValuesPage} />

            <PrivateRoute path="/admin/users" roles={['Admin']} component={UserList} />
            <PrivateRoute path="/admin/galleries" roles={['Admin']} component={GalleryList} />

            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/account/login" component={LoginForm} />
            <Route path="/account/signup" exact component={SignupForm} />
            <Route path="/account/signup/confirm" component={ConfirmSignup} />
            <Route path="/account/password/forgotten" component={ForgotPasswordForm} />
            <Route path="/account/password/reset" component={ResetPassword} />
            <PrivateRoute path="/account/password/change" roles={['Member','Manager','Admin']} component={ChangePasswordForm} />

            <PrivateRoute path="/profile" roles={['Member','Manager','Admin']} component={ProfilePage} />


            <Route component={NotFound} />
            {/* <Route exact path="/" component={IndexPage} /> */}
          </Switch>
        </Container>
      </ResponsiveContainer>
    </Router>
  );
}

export default App;
