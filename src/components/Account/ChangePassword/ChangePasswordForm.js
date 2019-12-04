import React, {useState} from 'react';
import { Grid, Header, Image, Message, Segment, Container, Button, Form, Input } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { authenticationService } from '../../../services/authenticationService';
import authAxios from '../../../helpers/authAxios';
import qs from 'query-string';
import config from 'react-global-configuration';

const API_DOMAIN = config.get('apiDomain');

export const ChangePasswordForm = ({match, location}) => {
    const [changeSucceeded, setChangeSucceeded] = useState(false);
    const [wasSubmitted, setWasSubmitted] = useState(false);

    const username = authenticationService.getCurrentUsername();

    const formik = useFormik({
        initialValues: {
          oldPassword: '',
          password: '',
          confirmPassword: ''
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
            .required('Old Password is required'),
            password: Yup.string()
                        .min(3, 'Password must be at least 3 characters long')
                        .required('Password is required'),
            confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password'), null], "Passwords must match")
                        .required('Password confirm is required'),
        }),
        onSubmit: ({ email, password, oldPassword }, { setStatus, setSubmitting }) => {
            setWasSubmitted(true);
            setSubmitting(true);
            setStatus();

            authAxios.post(`${API_DOMAIN}/api/account/password/change`,
                {
                    oldPassword: oldPassword,
                    newPassword: password
                },
                {
                    crossdomain: true,
                })
                .then(reply => {
                    setSubmitting(false);
                    setChangeSucceeded(true);
                })
                .catch(error => {
                    setSubmitting(false);
                    setChangeSucceeded(false);
                })
            },
      });

    return(
        <Container fluid> 
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' textAlign='center'>Change Password</Header>
                        {!wasSubmitted &&
                            <Form size='large' onSubmit={formik.handleSubmit}>
                            <Segment stacked>
                            <Form.Field>
                                <Form.Input fluid icon='lock' iconPosition='left'
                                id='oldPassword'
                                name='oldPassword'
                                type='password'
                                placeholder='Old Password'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.oldPassword}
                                error={formik.touched.oldPassword && formik.errors.oldPassword ? formik.errors.oldPassword : false}
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
                            <Form.Button primary fluid size='large' disabled={(formik.errors.password || formik.errors.confirmPassword || formik.errors.oldPassword) ? true : false}>Change Password</Form.Button>
                            </Segment>
                        </Form>
                        }
                        {wasSubmitted && changeSucceeded &&
                            <SuccessMessage />
                        }
                        {wasSubmitted && !changeSucceeded &&
                            <FailedMessage />
                        }
                    </Grid.Column>
                </Grid>
        </Container>);
};

const SuccessMessage = () => {
    return(
        <Message success>
            <Message.Header>Password Change completed.</Message.Header>
            <p>You successfully changed your Password.</p>
        </Message>
    );
}

const FailedMessage = () => {
    return(
        <Message error>
            <Message.Header>Password Change failed.</Message.Header>
            <p>Sorry, we could not change your Password.</p>
        </Message>
    );
}