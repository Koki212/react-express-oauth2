import { NavLink } from 'react-router-dom';
import { Button, CardActions, CardContent, FormControl, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { post } from '../helpers/api.js';

function Register() {
  // we need to store the entered email and password (2 times for password repeat), also we store a variable for an error we might show
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  // this function is called when user clicks register
  const submit = async () => {
    // we check if the user entered an email address
    if (email.trim().length === 0) {
      setError('E-Mail address is required.');
      return;
    }
    // we check that the email address at least contains an @ and a . and some characters before, after and between them with a RegEx
    if (!email.match(/.+@.+\..+/)) {
      setError('Please enter a valid email.');
      return;
    }
    // we check if the user entered a long enough password
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    // check if entered passwods are equal
    if (password !== password2) {
      setError('The passwords don\'t match.');
      return;
    }

    // we send a post request with email and password using our own post function (see helpers/api.js), make sure to await it!
    const response = await post(
      '/auth/register',
      {
        email,
        password,
      },
      false
    );

    // handle response data
    if (response.data) {
      // TODO: handle success
    } else {
      // when response does not contain data, show an error
      setError('Registration failed, please try again.');
    }
  };

  // render register form
  return (
    <>
      <CardContent>
        <Typography gutterBottom variant="h5">
          Sign Up
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: '16px' }}>
          <TextField
            required
            label="E-Mail"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError('');
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: '16px' }}>
          <TextField
            required
            label="Password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            required
            label="Repeat Password"
            type="password"
            value={password2}
            onChange={(event) => {
              setPassword2(event.target.value);
              setError('');
            }}
          />
        </FormControl>
        <Typography variant="caption" color="error.main" sx={{ marginBottom: '10px', marginTop: '6px', display: 'inline-block', width: '100%' }}>
          { error }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <span>Already have an account?</span><br/>
          <NavLink
            to="/login"
          >
            Go to login.
          </NavLink>
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={submit}>Register</Button>
      </CardActions>
    </>
  );
}

export default Register;
