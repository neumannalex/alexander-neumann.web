import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../helpers/handle-response';
import axios from 'axios';
import * as JWT from 'jwt-decode';
import config from 'react-global-configuration';

const API_DOMAIN = config.get('apiDomain');
const FRONTEND_DOMAIN = 'http://localhost:3000';


const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    refreshLogin,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
    isLoggedIn,
    isMember,
    isManager,
    isAdmin,
    hasRoles,
    getCurrentUsername,
    getCurrentUserRoles,
    getCurrentAccessToken,
    getCurrentRefreshToken
};

function isLoggedIn() {
    if(currentUserSubject.value) {
        return true;
    }
    else {
        return false;
    }
}

function isAnonymous() {
    if(currentUserSubject.value) {
        return false;
    }
    else {
        return true;
    }
}

function isMember() {
    var roles = getCurrentUserRoles();
    if(roles.indexOf('Member') > -1)
    {
        return true;
    }
    else {
        return false;
    }
}

function isManager() {
    var roles = getCurrentUserRoles();
    if(roles.indexOf('Manager') > -1)
    {
        return true;
    }
    else {
        return false;
    }
}

function isAdmin() {
    var roles = getCurrentUserRoles();
    if(roles.indexOf('Admin') > -1)
    {
        return true;
    }
    else {
        return false;
    }
}

function hasRoles(rolenames) {
    if(!isLoggedIn()) {
        return false;
    }

    var hasRoles = false;
    var roles = getCurrentUserRoles();
    for(var i = 0; i < rolenames.length; i++) {
        if(roles.indexOf(rolenames[i]) > -1)
        {
            hasRoles = true;
            break;
        }
    }

    return hasRoles;
}

function getCurrentUser() {
    if(currentUserSubject.value) {
        var decoded_token = JWT(currentUserSubject.value.accessToken);

        return decoded_token;
    }
    else {
        return null;
    }
}

function getCurrentUserRoles() {
    if(!isLoggedIn()) {
        return [];
    }
    
    var currentUser = getCurrentUser();
    var roles = currentUser['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if(!roles) {
        return [];
    }
    else {
        if(Array.isArray(roles)) {
            return roles;
        }
        else {
            return [roles];
        }
    }
}

function getCurrentUsername() {
    if(!isLoggedIn()) {
        return '';
    }

    var currentUser = getCurrentUser();

    var username = currentUser['unique_name'];
    return username;
}

function getCurrentAccessToken() {
    if(!isLoggedIn()) {
        return '';
    }

    var currentUser = currentUserSubject.value;
    if(!currentUser) {
        return '';
    }

    if(!currentUser.accessToken) {
        return '';
    }

    return currentUser.accessToken;
}

function getCurrentRefreshToken() {
    if(!isLoggedIn()) {
        return '';
    }

    var currentUser = currentUserSubject.value;
    if(!currentUser) {
        return '';
    }

    if(!currentUser.refreshToken) {
        return '';
    }

    return currentUser.refreshToken;
}

function login(username, password) {
    return fetch(`${API_DOMAIN}/api/Account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password: password })
    })
    .then(handleResponse)
    .then(user => {
        var decoded_token = JWT(user.accessToken);
        console.log(decoded_token);

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUserSubject.next(user);

        return user;
    });
}

async function refreshLogin() {
    try
    {
        const currentAccessToken = getCurrentAccessToken();
        const currentRefreshToken = getCurrentRefreshToken();

        //console.log('refreshLogin');

        const response = await axios({
            method: 'post',
            url: `${API_DOMAIN}/api/Account/refreshlogin`,
            data: {
                accessToken: currentAccessToken,
                refreshToken: currentRefreshToken
            }
        });

        //console.log('refreshLogin returned with', response);

        if(!response.data) {
            //console.log('refreshLogin returned no data. Response is', response);
            return null;
        }

        const user = response.data;
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUserSubject.next(user);
        const newAccessToken = getCurrentAccessToken();

        //console.log('refreshLogin response.data', user);
        //console.log('refreshLogin will return token', newAccessToken);

        return newAccessToken;
    }
    catch(err) {
        //console.log('error in refreshLogin', err);
        return null;
    }
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}