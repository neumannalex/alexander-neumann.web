import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../helpers/handle-response';
import axios from 'axios';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
    isLoggedIn,
    isMember,
    isAdmin
};

function isLoggedIn() {
    if(currentUserSubject.value) {
        return true;
    }
    else {
        return false;
    }
}

function isMember() {
    if(currentUserSubject.value) {
        if(currentUserSubject.value.roles.indexOf('Member') > -1)
        {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

function isAdmin() {
    if(currentUserSubject.value) {
        if(currentUserSubject.value.roles.indexOf('Admin') > -1)
        {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    //https://localhost:44385/api/Authentication/token
    return fetch(`https://test.alexander-neumann.net/api/Authentication/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}