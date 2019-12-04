import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from '../../services/authenticationService';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const isLoggedIn = authenticationService.isLoggedIn;
        if (!isLoggedIn) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        var hasRole = false;
        if(roles) {
            hasRole = authenticationService.hasRoles(roles);
        }

        if(!hasRole) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/'}} />
        }
        else {
            // authorised so return component
        return <Component {...props} />
        }
    }} />
)