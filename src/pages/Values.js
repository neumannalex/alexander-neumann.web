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
  Table
} from "semantic-ui-react";
import authAxios from '../helpers/authAxios';
import config from 'react-global-configuration';

const API_DOMAIN = config.get('apiDomain');
const FRONTEND_DOMAIN = 'http://localhost:3000';

export const ValuesPage = () => {
    const [values, setValues] = useState([]);

    useEffect(() => {
        authAxios.get(`${API_DOMAIN}/api/values`, {
            crossdomain: true,
        })
        .then(reply => {
          const values = reply.data;
          setValues(values);
        })
        .catch(error => {
            console.log('request error', error);
        })
    }, []);

    return (
    <Container>
      <Header as="h1">Values List</Header>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Key</Table.HeaderCell>
            <Table.HeaderCell>Values</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            values.map((value, index) =>
              <Table.Row key={index}>
                <Table.Cell>{index}</Table.Cell>
                <Table.Cell>{value}</Table.Cell>
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