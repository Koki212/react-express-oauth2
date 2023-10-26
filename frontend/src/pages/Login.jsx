import { NavLink } from 'react-router-dom';
import { Button, CardActions, CardContent, FormControl, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { post } from '../helpers/api.js';

function Login() {
  // we need to store the entered email and password, also we store a variable for an error we might show
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // this function is called when user clicks login
  const submit = async () => {
    // we check if the user entered an email address (no need to check for valid email addresses here, server will return an error)
    if (email.trim().length === 0) {
      setError('E-Mail address is required.');
      return;
    }
    // we check if the user entered a password
    if (password.length === 0) {
      setError('Password is required.');
      return;
    }

    // we send a post request with email and password using our own post function (see helpers/api.js), make sure to await it!
    const response = await post(
      '/auth/token',
      {
        email,
        password,
      },
      false
    );

    // handle response data
    if (response.data) {
      // TODO: handle tokens from data
    } else {
      // when response does not contain data, show an error
      setError('Login failed, please check your credentials.');
    }
  };

  // render login form
  return (
    <>
      <CardContent sx={{ width: '350px' }}>
        <Typography gutterBottom variant="h5">
          Sign In
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
        <FormControl fullWidth>
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
        <Typography variant="caption" color="error.main" sx={{ marginBottom: '10px', marginTop: '6px', display: 'inline-block', width: '100%' }}>
          { error }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <span>Don't have an account yet?</span><br/>
          <NavLink
            to="/register"
          >
            Register now.
          </NavLink>
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={submit}>Login</Button>
      </CardActions>
    </>
  );
}

export default Login;
