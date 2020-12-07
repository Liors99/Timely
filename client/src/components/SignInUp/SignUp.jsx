import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  makeStyles
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SERVER_ADDRESS, loggedInUser } from '../../AppConfig.js'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    background: '#7ED3D6',
    '&:hover': {
      background: "#53b7bb",
    },
    margin: theme.spacing(2, 0, 2),
  }
}));

export default function SignUp(props) {
  const [errorMsg, setErrorMsg] = useState("");
  const classes = useStyles();

  function handleSignUp(e) {
    e.preventDefault();
    const signUpRequest = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      password2: document.getElementById('password2').value
    }


    //Validate username
    if (signUpRequest.username.split(' ').length > 1) {
      setErrorMsg("Username cannot contain spaces");
      return;
    }
    //Check if username contains any characters that are not whitelisted
    else if (signUpRequest.username.match(/[^a-z^A-Z^0-9\^_]/)) {
      setErrorMsg("Username can only contain characters from a-z, numbers, or underscores");
      return;
    }


    //Validate password
    if (signUpRequest.password.length < 3) {
      setErrorMsg("Password must be at least 3 characters long");
      return;
    }
    else if (signUpRequest.password !== signUpRequest.password2) {
      setErrorMsg("Passwords do not match");
      return;
    }

    axios.post(SERVER_ADDRESS + "/users/signup", signUpRequest)
      .then(res => {
        loggedInUser.id = res.data.userInfo._id;
        loggedInUser.username = res.data.userInfo.username;
        loggedInUser.isAdmin = res.data.userInfo.isAdmin;
        loggedInUser.profileImage = res.data.userInfo.profileImage;

        //Set the token
        const token = res.data.token;
        localStorage.setItem('token', token);
        props.setLoggedIn(true);
        props.onCancel();
      }).catch(err => {
        setErrorMsg("Username is already taken")
      })

  }

  //Renders the error message if anything is wrong with the signup
  const renderError = () => {
    if (errorMsg !== "") {
      return (
        <Grid item xs={12}>
          <Alert xs={12} variant="outlined" severity="error">
            {errorMsg}
          </Alert>
        </Grid>

      );
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
          </Typography>
        <form onSubmit={handleSignUp} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="username" label="User Name" name="email" autoComplete="email" />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth name="password2" label="Repeat password" type="password" id="password2" autoComplete="current-password" />
            </Grid>
            {renderError()}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign Up
                </Button>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={props.onCancel} className={classes.submit}>
              Cancel
                </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );

}


SignUp.propTypes = {
  onCancel: PropTypes.func
};

export { SignUp };