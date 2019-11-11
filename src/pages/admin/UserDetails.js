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
  Modal
} from "semantic-ui-react";
import axios from 'axios';
import _ from 'lodash';

export const UserDetails = ({user, mode, trigger}) => {

    const editModes = ['view', 'edit', 'new', 'delete'];
    if(editModes.indexOf(mode) < 0) {
        mode = 'view';
    }

    const [isDialogOpen, setIsDialogOpen] = useState();

    const cancelDialog = () => {
        setIsDialogOpen(false);
    }

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const getContent = (user, mode) => {
        switch(mode) {
            case 'view':
                return <UserView user={user} />
                break;
            case 'edit':
                return <UserEdit user={user} />
                break;
            case 'new':
                return <UserNew user={user} />
                break;
            case 'delete':
                return <UserDelete user={user} />
                break;
            default:
                return <UserView user={user} />
        }
    }

    return(
        <Modal trigger={trigger} open={isDialogOpen}>
            <Modal.Header>{capitalize(mode)} User</Modal.Header>
            <Modal.Content>
            {
                getContent(user, mode)
            }
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={cancelDialog}>Cancel</Button>
            </Modal.Actions>
        </Modal>
    );
}

const UserView = ({user}) => {
    return(
        <div>
            <div>View</div>
            <div>{JSON.stringify(user)}</div>
        </div>
    );
}

const UserEdit = ({user}) => {
    return(
        <div>
            <div>Edit</div>
            <div>{JSON.stringify(user)}</div>
        </div>
    );
}

const UserNew = ({user}) => {
    return(
        <div>
            <div>New</div>
            <div>{JSON.stringify(user)}</div>
        </div>
    );
}

const UserDelete = ({user}) => {
    return(
        <div>
            <div>Delete</div>
            <div>{JSON.stringify(user)}</div>
        </div>
    );
}