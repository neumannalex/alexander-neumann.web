import axios from 'axios';
import { config } from 'rxjs';
import { authenticationService } from '../services/authenticationService';

const authAxios = axios.create();

// Request Interceptor:
// Adds Authorization Header if user is logged in
authAxios.interceptors.request.use(config => {
    if(authenticationService.isLoggedIn()) {
        var token = authenticationService.getCurrentAccessToken();
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    //console.log('authAxios Interceptor', config);

    return config;
});

// Response Interceptor:
// If response is 401 or 403 try to refresh Access Token and repeat original request
// Only one try!
authAxios.interceptors.response.use(
    response => {
        //console.log('authAxios Response Interceptor response', response);
        return response;
    },
    error => {
        //console.log('authAxios Response Interceptor error', error);
        const {config, response: {status}} = error
        const errorResponse = error.Response;
        const originalRequest = config;

        //console.log('authAxios Response Interceptor originalRequest', originalRequest);

        if(isTokenExpiredError(status)) {
            var retry = refreshTokenAndRetryRequest(error);
            return retry;
        }

        return Promise.reject(error);
    }
);

function isTokenExpiredError(status) {
    //console.log('isTokenExpiredError status', status);

    if(status === 401 || status === 403) {
        return true;
    }
    else {
        return false;
    }
}

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

async function refreshTokenAndRetryRequest(error) {
    try
    {
        const { response: errorResponse } = error;
        const oldAccessToken = authenticationService.getCurrentAccessToken();
        const oldRefreshToken = authenticationService.getCurrentRefreshToken();
        if(!oldAccessToken || !oldRefreshToken) {
            return Promise.reject(error);
        }

        /* Proceed to the token refresh procedure
        We create a new Promise that will retry the request,
        clone all the request configuration from the failed
        request in the error object. */
        const retryOriginalRequest = new Promise(resolve => {
            /* We need to add the request retry to the queue
            since there another request that already attempt to
            refresh the token */
            addSubscriber(access_token => {
                //console.log('refreshTokenAndRetryRequest re-trying request with new token', access_token);
                errorResponse.config.headers.Authorization = 'Bearer ' + access_token;
                resolve(axios(errorResponse.config));
            });
        });
        if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            //console.log('refreshTokenAndRetryRequest will call refreshLogin');
            const newToken = await authenticationService.refreshLogin();
            //console.log('refreshTokenAndRetryRequest has called refreshLogin and got new token', newToken);
            if(!newToken) {
                //console.log('refreshTokenAndRetryRequest will call refreshLogin failed');
                authenticationService.logout();
                window.location = '/account/login';
            }
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newToken);
        }
        return retryOriginalRequest;
    }
    catch(err) {
        return Promise.reject(error);
    }
}

function addSubscriber(callback) {
    subscribers.push(callback);
}

function onAccessTokenFetched(access_token) {
    // When the refresh is successful, we start retrying the requests one by one and empty the queue
    subscribers.forEach(callback => callback(access_token));
    subscribers = [];
}


export default authAxios;