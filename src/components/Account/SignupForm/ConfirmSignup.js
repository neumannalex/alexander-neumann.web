import React, {useState, useEffect} from 'react';
import { Grid, Header, Image, Message, Segment, Container, Dimmer, Loader, ListItem } from 'semantic-ui-react';
import { Button, Dropdown, Form, Input, Checkbox, Radio} from 'formik-semantic-ui';
import axios from 'axios';
import qs from 'query-string';
import config from 'react-global-configuration';

const API_DOMAIN = config.get('apiDomain');

export const ConfirmSignup = ({match, location}) => {
    const [confirmationSucceeded, setConfirmationSucceeded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [parameters, setParameters] = useState({});

    useEffect(() => {
        let p = qs.parse(location.search, {decode: false});

        if(p.userId && p.code) {
            setParameters(p);
            setIsSubmitting(true);

            axios.get(`${API_DOMAIN}/api/account/confirm`, {
                params: {
                    userId: p.userId,
                    code: p.code
                },
                crossdomain: true,
            })
            .then(reply => {
                setIsSubmitting(false);
                setConfirmationSucceeded(true);
            })
            .catch(error => {
                setIsSubmitting(false);
                setConfirmationSucceeded(false);
                //console.log('request error', error);
            })
        }
        else {
            setParameters(p);
        }
    }, []);


    if(!parameters.userId || !parameters.code) {
        return(
            <MissingParametersMessage parameters={parameters} />
        );
    }
    else {
        return (
            <div>
                <Dimmer inverted active={isSubmitting} />
                <Loader active={isSubmitting} />
                {isSubmitting &&
                    <div>Confirming your signup...</div>
                }
                {!isSubmitting  &&
                    confirmationSucceeded ? <SuccessMessage /> : <FailedMessage />
                }
            </div>
        );
    }

    
}

const MissingParametersMessage = (props) => {
    return(
        <Message error>
            <Message.Header>We cannot confirm your signup since parameters are missing.</Message.Header>
            <p>Please make sure that you paste the whole Url from the signup confirmation mail to your browser.</p>
            The following parameters are missing:
            <Message.List>
                {!props.parameters.userId && <Message.Item>UserId</Message.Item>}
                {!props.parameters.code && <Message.Item>Code</Message.Item>}
            </Message.List>
        </Message>
    );
}

const SuccessMessage = () => {
    return(
        <Message success>
            <Message.Header>Sign up confirmed.</Message.Header>
            <p>You successfully confirmed your signup.</p>
        </Message>
    );
}

const FailedMessage = () => {
    return(
        <Message error>
            <Message.Header>Signup not confirmed.</Message.Header>
            <p>Sorry, we could not confirm your signup. Please check your confirmation mail an try again.</p>
        </Message>
    );
}