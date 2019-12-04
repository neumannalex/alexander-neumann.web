import React, {useState} from 'react';
import { Grid, Header, Image, Message, Segment, Container, Dimmer, Loader } from 'semantic-ui-react';
import { Button, Dropdown, Form, Input, Checkbox, Radio} from 'formik-semantic-ui';
import axios from 'axios';
import config from 'react-global-configuration';

const API_DOMAIN = config.get('apiDomain');
const FRONTEND_DOMAIN = 'http://localhost:3000';

export const ForgotPasswordForm = (props) => {
    const [errorMessage, setErrorMessage] = useState();
    const [errors, setErrors] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const _handleSubmit = (values, formikApi) => {
        setIsSubmitting(true);
        axios.post(`${API_DOMAIN}/api/account/password/forgot`,
        {
          "email": values.email,
          "resetPasswordUrl": FRONTEND_DOMAIN + '/account/password/reset'
        },
        {
            crossdomain: true,
        })
            .then(reply => {
              setHasError(false);
              setErrorMessage("");
              setErrors([]);
              setSucceeded(true);
              setIsSubmitting(false);
            })
            .catch(error => {
              setHasError(true);
              setSucceeded(false);
              setIsSubmitting(false);

              if(error.response)
              {
                setErrorMessage(error.response.data.message);
                setErrors(error.response.data.errors);
              } else if(error.request) {
                setErrorMessage("Application does not respond to forgot password request.");
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
        
        return errors;
      };


  return(
  <Container fluid> 
    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' textAlign='center'>Forgotten Password</Header>
        {!succeeded ? (
          <div>
            <Form size='large'
            initialValues={{email:'Mail'}}
            onSubmit={_handleSubmit}
            validate={_validate}>
            <Segment stacked>
              <Dimmer inverted active={isSubmitting} />
              <Loader active={isSubmitting} />
              <Input fluid icon='user' iconPosition='left' placeholder='E-mail address' name='email'/>
              <Button.Submit primary fluid size='large'>Send</Button.Submit>
            </Segment>
          </Form>
            <Message error hidden={!hasError}>
              <Message.Header>An error occured</Message.Header>
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
            <Message.Header>Forgotten Password</Message.Header>
            <p>Please check your mailbox to reset your password.</p>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  </Container>);
};