import React from 'react';
import { Grid, Header, Image, Message, Segment, Container } from 'semantic-ui-react';
import {
    Button,
    Dropdown,
    Form,
    Input,
    Checkbox,
    Radio
  } from 'formik-semantic-ui';

export const SignupForm = () => {


    const _handleSubmit = (values, formikApi) => {
        console.log(values, formikApi);
    }

    const _validate = values => {
        let errors = {};
    
        if (!values.email) {
          errors.email = "Required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }
    
        if (!values.password) {
          errors.password = "Required";
        }
    
        return errors;
      };


    return(
        <Container fluid> 
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' textAlign='center'>Create a new account</Header>
                <Form size='large' initialValues={{email:'Mail', password:'1234'}} onSubmit={_handleSubmit} validate={_validate}>
                    <Segment stacked>
                        <Input fluid icon='user' iconPosition='left' placeholder='E-mail address' name='email'/>
                        <Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            inputProps={{
                                type: 'password',
                              }}
                            name='password'
                        />

                        <Button.Submit primary fluid size='large'>Create</Button.Submit>
                    </Segment>
                </Form>
                </Grid.Column>
            </Grid>
        </Container>);
};