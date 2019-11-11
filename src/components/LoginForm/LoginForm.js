import React, {useState} from 'react';
import { Grid, Header, Image, Message, Segment, Container, Button, Form, Input } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { authenticationService } from '../../services/authenticationService';

export const LoginForm = (props) => {
    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                        //.email('Invalid email address')
                        .required('Required'),
            password: Yup.string()
                        .min(3, 'Must be at least 3 characters long')
                        .required('Required')
        }),
        onSubmit: ({ email, password }, { setStatus, setSubmitting }) => {
          setStatus();
          authenticationService.login(email, password)
            .then(
              user => {
                const { from } = props.location.state || { from: { pathname: "/" } };
                //console.log('Login ok. From:', from);
                props.history.push(from);
              },
              error => {
                //console.log('Login failed');
                setSubmitting(false);
                setStatus(error);
              }
            );

          //alert(JSON.stringify(values, null, 2));
        },
      });

    return(
        <Container fluid> 
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' textAlign='center'>Log in to your account</Header>
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
                        <Form.Button primary fluid size='large' disabled={(!formik.touched.email || !formik.touched.password || formik.errors.email || formik.errors.password) ? true : false}>Login</Form.Button>
                      </Segment>
                    </Form>
                    <Message>
                        Not registered yet? <Link to="/signup">Sign Up</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        </Container>);
};