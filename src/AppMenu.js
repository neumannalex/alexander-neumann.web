import React, { Component, useState, useEffect } from 'react';
import {
  Container,
  Image,
  Menu,
  Dropdown,
} from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { authenticationService } from './services/authenticationService';

export const AppMenu = () => {
  const [currentUser, setCurrentUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const test = authenticationService.isLoggedIn();

    authenticationService.currentUser.subscribe(user => {
      setCurrentUser(user);

      //console.log(user);

      if(user) {
        setIsLoggedIn(authenticationService.isLoggedIn());
        setIsMember(authenticationService.isMember());
        setIsAdmin(authenticationService.isAdmin());
      }
      else {
        setIsLoggedIn(false);
        setIsMember(false);
        setIsAdmin(false);
      }


    });
  });

  return (
    <Container>
      <Menu.Item as={Link} to='/' header>
          <Image size="mini" src="/myLogo192.png" style={{ marginRight: "1.5em" }} />
          alexander-neumann.net
      </Menu.Item>
      <Menu.Item as={NavLink} to='/home' activeClassName="active">Home</Menu.Item>
      {isMember &&
      <Menu.Item as={NavLink} to='/gallery' activeClassName="active">Gallery</Menu.Item>
      }
      {isAdmin &&
      <Dropdown item text='Admin'>
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to='/admin/users' activeClassName="active">Users</Dropdown.Item>
          <Dropdown.Item as={NavLink} to='/admin/galleries' activeClassName="active">Galleries</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      }
    </Container>
  );
}