import PropTypes from 'prop-types';
import React, { Component, useState, useEffect } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { authenticationService } from './services/authenticationService';

import {AppMenu} from './AppMenu';
import {Footer} from './components/Footer/Footer';

// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
    const isSSR = typeof window === 'undefined'
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const LoginSigninMenu = () => {
  const [currentUser, setCurrentUser] = useState();
  let history = useHistory();

  useEffect(() => {
    authenticationService.currentUser.subscribe(user => {
      setCurrentUser(user)
    });
  });

  const logout = () =>{
    authenticationService.logout();
    history.push('/login');
  }

  return(
    <Menu.Menu position='right'>
      {currentUser &&
        <Menu.Item>
          <Button as={Link} to="/profile" circular icon="user" color="blue" />
        </Menu.Item>
      }
      {currentUser &&
        <Menu.Item>
          <Button as="a" onClick={logout} inverted>Log out</Button>
        </Menu.Item>
      }
      {!currentUser &&
        <Menu.Item>
          <Button as={Link} to="/login" inverted>Log in</Button>
        </Menu.Item>
      }
    </Menu.Menu>
  );
}

const DesktopContainer = (props) => {  
  const { children, footerHeight } = props

  return (
    <Responsive id="main-responsive" getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility id="main-visibility" once={false}>
        <Menu id="main-menu" fixed='top' inverted size='large'>
          <AppMenu />
          <LoginSigninMenu />
        </Menu>
      </Visibility>
      {children}
      <Footer height={footerHeight} />
    </Responsive>
  )
}
  
DesktopContainer.propTypes = {
  children: PropTypes.node
}

const MobileContainer = (props) => {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const onSidebarHide = () => setSidebarOpened(false); 
  const openSidebar = () => setSidebarOpened(true);
  const { children, footerHeight } = props

  return (
    <Responsive as={Sidebar.Pushable} getWidth={getWidth} maxWidth={Responsive.onlyMobile.maxWidth}>
      <Sidebar as={Menu} animation='push' inverted onHide={onSidebarHide} vertical visible={sidebarOpened}
      >
        <AppMenu />
      </Sidebar>

      <Sidebar.Pusher dimmed={sidebarOpened}>
        <Segment inverted textAlign='center' vertical>
          <Container>
            <Menu inverted pointing secondary size='large'>
              <Menu.Item onClick={openSidebar}>
                <Icon name='sidebar' />
              </Menu.Item>
              <LoginSigninMenu />
            </Menu>
          </Container>
        </Segment>
        {children}
        <Footer height={footerHeight} />
      </Sidebar.Pusher>
    </Responsive>
  )
}
  
MobileContainer.propTypes = {
children: PropTypes.node,
}

export const ResponsiveContainer = ({ footerHeight, children }) => {
  return (
    <div id="responsivecontainer" className="site">
      <DesktopContainer footerHeight={footerHeight} >{children}</DesktopContainer>
      <MobileContainer footerHeight={footerHeight} >{children}</MobileContainer>
    </div>
  )
}
  
ResponsiveContainer.propTypes = {
children: PropTypes.node,
}