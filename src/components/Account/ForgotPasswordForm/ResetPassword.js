import React, {useState} from 'react';
import { Grid, Header, Image, Message, Segment, Container, Button, Form, Input } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { authenticationService } from '../../../services/authenticationService';
import axios from 'axios';
import qs from 'query-string';
import config from 'react-global-configuration';

const API_DOMAIN = config.get('apiDomain');

export const ResetPassword = ({match, location}) => {
    const [resetSucceeded, setResetSucceeded] = useState(false);
    const [wasSubmitted, setWasSubmitted] = useState(false);

    let p = qs.parse(location.search, {decode: false});

    const formik = useFormik({
        initialValues: {
          email: p.email,
          password: '',
          confirmPassword: '',
          code: p.code
        },
        validationSchema: Yup.object({
            email: Yup.string()
                        //.email('Invalid email address')
                        .required('Email is required'),
            password: Yup.string()
                        .min(3, 'Password must be at least 3 characters long')
                        .required('Password is required'),
            confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password'), null], "Passwords must match")
                        .required('Password confirm is required'),
            code: Yup.string()
                        .required('Reset code is required')
        }),
        onSubmit: ({ email, password, code }, { setStatus, setSubmitting }) => {
            setWasSubmitted(true);
            setSubmitting(true);
            setStatus();

            axios.post(`${API_DOMAIN}/api/account/password/reset`,
                {
                    email: email,
                    code: code,
                    newPassword: password
                },
                {
                    crossdomain: true,
                })
                .then(reply => {
                    setSubmitting(false);
                    setResetSucceeded(true);
                })
                .catch(error => {
                    setSubmitting(false);
                    setResetSucceeded(false);
                    //console.log('request error', error);
                })
            },
      });

    return(
        <Container fluid> 
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' textAlign='center'>Set new Password</Header>
                        {!wasSubmitted &&
                            <Form size='large' onSubmit={formik.handleSubmit}>
                            <Segment stacked>
                            <Form.Field>
                                <Form.Input fluid icon='user' iconPosition='left'
                                id='email'
                                name='email'
                                placeholder='Email'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                error={formik.touched.email && formik.errors.email ? formik.errors.email : false}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input fluid icon='lock' iconPosition='left'
                                id='password'
                                name='password'
                                type='password'
                                placeholder='Password'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                error={formik.touched.password && formik.errors.password ? formik.errors.password : false}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input fluid icon='lock' iconPosition='left'
                                id='confirmPassword'
                                name='confirmPassword'
                                type='password'
                                placeholder='Confirm Password'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                                error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : false}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input fluid icon='user' iconPosition='left'
                                id='code'
                                name='code'
                                placeholder='Code'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.code}
                                error={formik.touched.code && formik.errors.code ? formik.errors.code : false}
                                />
                            </Form.Field>
                            <Form.Button primary fluid size='large' disabled={(!formik.touched.email || !formik.touched.password || !formik.touched.code || formik.errors.email || formik.errors.password || formik.errors.code) ? true : false}>Save</Form.Button>
                            </Segment>
                        </Form>
                        }
                        {wasSubmitted && resetSucceeded &&
                            <SuccessMessage />
                        }
                        {wasSubmitted && !resetSucceeded &&
                            <FailedMessage />
                        }
                    </Grid.Column>
                </Grid>
        </Container>);
};

const SuccessMessage = () => {
    return(
        <Message success>
            <Message.Header>Password Reset completed.</Message.Header>
            <p>You successfully changed your Password.</p>
        </Message>
    );
}

const FailedMessage = () => {
    return(
        <Message error>
            <Message.Header>Password Reset failed.</Message.Header>
            <p>Sorry, we could not change your Password.</p>
        </Message>
    );
}