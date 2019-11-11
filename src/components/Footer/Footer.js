import React, { Component } from "react";
import { Link } from 'react-router-dom';
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
  Segment,
  Sticky
} from "semantic-ui-react";
import {Counter} from '../Counter/Counter';

export const Footer = (props) => {
  const {height} = props;

  return(
      <Segment
      id="main-footer"
      inverted
      vertical
      style={{ padding: "1em 0em", height: height}}
    >
      <Container textAlign="center">
        {/* <Divider inverted section /> */}
        <Image centered size="mini" src="/myLogo192.png" />
        <List horizontal inverted divided link size="small">
          <List.Item as="a" href="#root">
            Site Map
          </List.Item>
          <List.Item as="a" href="#root">
            Contact Us
          </List.Item>
          <List.Item as="a" href="#root">
            Terms and Conditions
          </List.Item>
          <List.Item as={Link} to="/privacy">
            Privacy Policy
          </List.Item>
          <List.Item>
            <Counter />
          </List.Item>
        </List>
      </Container>
    </Segment>
  );
}