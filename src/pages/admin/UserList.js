import React, { Component, useState, useEffect } from "react";
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
  Tab,
  Table,
  Button,
  Confirm,
  Modal,
  Label
} from "semantic-ui-react";
import axios from 'axios';
import authAxios from '../../helpers/authAxios';
import _ from 'lodash';
import {UserDetails} from './UserDetails';
import config from 'react-global-configuration';

const API_DOMAIN = config.get('apiDomain');



export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState();
  const [currentItem, setCurrentItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSort = (clickedColumn) => () => {
    if(sortColumn !== clickedColumn) {
      setSortColumn(clickedColumn);
      setUsers(_.sortBy(users, [clickedColumn]));
      setSortDirection('ascending');

      return;
    }

    setUsers(_.reverse(users));
    setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
  }

  const handleDelete = (user) => () => {
    setCurrentItem(user);
    setShowDeleteConfirm(true);
  }

  const onConfirmDelete = () => {
    console.log('delete user', currentItem);

    // TODO: löschen implementieren

    setShowDeleteConfirm(false);
    setCurrentItem(null);
  }

  const onCancelDelete = () => {
    console.log('delete user CANCELED');
    setShowDeleteConfirm(false);
    setCurrentItem(null);
  }

  useEffect(() => {
      // axios.get('https://jsonplaceholder.typicode.com/users')
      //     .then(reply => {
      //       const users = reply.data;
      //       setUsers(users);
      //     })
      authAxios.get(`${API_DOMAIN}/api/users`)
          .then(reply => {
            const users = reply.data;
            setUsers(users);
            console.log('users', users);
          })
  }, []);

  return (
    
    <Container>
      <Header as="h1">User List</Header>
      <Confirm
        open={showDeleteConfirm}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        content={currentItem === null ? 'Are you sure?' : 'Do you really want to delete the user \'' + currentItem.username + '\'?'}
      />
      
      {/* <UserDetails user={currentItem} mode={detailsMode} open={showDetails} />   */}

      <Table celled>
        <Table.Header>
          <Table.Row>
            {/* <Table.HeaderCell
              sorted={sortColumn === 'id' ? sortDirection : null}
              onClick={handleSort('id')}
            >
              Id
            </Table.HeaderCell> */}
            <Table.HeaderCell
              sorted={sortColumn === 'username' ? sortDirection : null}
              onClick={handleSort('username')}
            >
              Username
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortColumn === 'email' ? sortDirection : null}
              onClick={handleSort('email')}
            >
              Email
            </Table.HeaderCell>
            <Table.HeaderCell>
              Roles
            </Table.HeaderCell>
            <Table.HeaderCell>
              Actions
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            users.map((user, index) =>
              <Table.Row key={index}>
                {/* <Table.Cell>{user.id}</Table.Cell> */}
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  {
                    user.roles.map((role, index) => <Label key={index} size="mini">{role}</Label> )
                  }
                </Table.Cell>
                <Table.Cell>
                  <UserDetails user={user} mode='view' trigger={
                    <Icon link name='search'/>
                  } />
                  <UserDetails user={user} mode='edit' trigger={
                    <Icon link name='edit'/>
                  } />
                  <UserDetails user={user} mode='delete' trigger={
                    <Icon link name='trash alternate outline'/>
                  } />
                  {/* <Icon link name='trash alternate outline' onClick={handleDelete(user)} /> */}
                </Table.Cell>
              </Table.Row>
            )
          }
        </Table.Body>
        <Table.Footer>

        </Table.Footer>
      </Table>
    </Container>
  );
}