import React, {useState} from 'react';
import { Grid, Header, Image, Message, Segment, Container, Dimmer, Loader } from 'semantic-ui-react';
import { Button, Dropdown, Form, Input, Checkbox, Radio} from 'formik-semantic-ui';
import axios from 'axios';
import config from 'react-global-configuration';

const API_DOMAIN = config.get('apiDomain');
const FRONTEND_DOMAIN = 'http://localhost:3000';

export const SignupForm = (props) => {
    const [errorMessage, setErrorMessage] = useState();
    const [errors, setErrors] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [registrationSucceeded, setRegistrationSucceeded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const _handleSubmit = (values, formikApi) => {
        setIsSubmitting(true);
        axios.post(`${API_DOMAIN}/api/Account/Register?confirmationUrl=${FRONTEND_DOMAIN}/accoun/signup/confirm`,
        {
          "email": values.email,
          "password": values.password,
          "confirmationUrl": FRONTEND_DOMAIN + '/account/signup/confirm'
        },
        {
            crossdomain: true,
        })
            .then(reply => {
              setHasError(false);
              setErrorMessage("");
              setErrors([]);
              setRegistrationSucceeded(true);
              setIsSubmitting(false);
            })
            .catch(error => {
              setHasError(true);
              setRegistrationSucceeded(false);
              setIsSubmitting(false);

              if(error.response)
              {
                setErrorMessage(error.response.data.message);
                setErrors(error.response.data.errors);
              } else if(error.request) {
                setErrorMessage("Application does not respond to registration request.");
                setErrors([]);
              } else {
                setErrorMessage("Oops... something bad happened.");
                setErrors([]);
              }
            })
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
        {!registrationSucceeded ? (
          <div>
            <Form size='large'
            initialValues={{email:'Mail', password:'1234'}}
            onSubmit={_handleSubmit}
            validate={_validate}>
            <Segment stacked>
              <Dimmer inverted active={isSubmitting} />
              <Loader active={isSubmitting} />
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
            <Message error hidden={!hasError}>
              <Message.Header>An error occured during registration</Message.Header>
              <p>{errorMessage}</p>
              <Message.List>
                {
                  errors.map((error, index) => <Message.Item key={index}>{error}</Message.Item>)
                }
              </Message.List>
            </Message>
          </div>
        ) : (
          <Message success>
            <Message.Header>Your user registration was successful</Message.Header>
            <p>Please check your mailbox to confirm your registration.</p>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  </Container>);
};