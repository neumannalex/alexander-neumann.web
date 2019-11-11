import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from '../../services/authenticationService';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        //console.log('PrivateRoute', currentUser);

        // check if route is restricted by role
        // if (roles && roles.indexOf(currentUser.role) === -1) {
        //     // role not authorised so redirect to home page
        //     return <Redirect to={{ pathname: '/'}} />
        // }
        let hasRole = false;
        if(roles) {
            for(var i = 0; i < roles.length; i++) {
                if(currentUser.roles.indexOf(roles[i]) > -1)
                {
                    hasRole = true;
                    break;
                }
            }
        }

        if(!hasRole) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/'}} />
        }
        else {
            // authorised so return component
        return <Component {...props} />
        }

        // authorised so return component
        //return <Component {...props} />
    }} />
)