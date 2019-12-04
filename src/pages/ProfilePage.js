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
  Button,
  ListItem,
  Card,
  Label
} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { authenticationService } from '../services/authenticationService';

export const ProfilePage = () => {
  const username = '' || authenticationService.getCurrentUsername();
  const roles = authenticationService.getCurrentUserRoles();

    return (
      <Card>
        <Card.Content>
          <Image floated="right" size="mini" src="images/avatar/avatar5.png" />
          <Card.Header>{username}</Card.Header>
          <Card.Meta>
            <div>
            {
              roles.map((role,index) => 
                <Label key={index} size="mini">{role}</Label>
                )
            }
            </div>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Link to="/account/password/change">Change Password</Link>
        </Card.Content>
      </Card>
    );
}