import React, { Component } from "react";
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
  Message
} from "semantic-ui-react";

export const NotFound = () => {
    return (
    <Message icon size='big'>
        <Icon size='big' color='red' name='dont' />
        
        <Message.Content>
            <Message.Header>Oops...</Message.Header>
            Page not found.
        </Message.Content>
    </Message>
    );
}