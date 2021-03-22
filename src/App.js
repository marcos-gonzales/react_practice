import React, { useState } from 'react';

import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Chatroom from './components/Chatroom/Chatroom';

import classes from './App.module.css';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState();
  const [loginErrorMessage, setLoginErrorMessage] = useState();
  const [signup, setupSignup] = useState();
  const [signupError, setSignupError] = useState();

  const setIntervalMessage = () => {
    setInterval(() => {
      setLoginMessage(false);
    }, 5000);
  };

  const createUsername = (e) => {
    e.preventDefault();
    const body = {
      username: username,
      password: password,
    };

    fetch('http://localhost:4000/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'THIS IS IN DATA');
        if (data.message) {
          setupSignup(data);
          setSignupError(false);
        }
        if (data.errors) {
          setSignupError(data);
        }
      })
      .catch((err) => {
        console.log(err, 'THIS IS IN ERROR');
        if (err.message) {
          setupSignup(err);
        }
        if (err.errors) {
          setSignupError(err);
        }
      })
      .finally((lastStep) => {
        console.log('reached here');
      });
  };

  const login = (e) => {
    e.preventDefault();
    const body = {
      signInUsername: signInUsername,
      signInPassword: signInPassword,
    };

    fetch('http://localhost:4000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.successMessage) {
          setLoginMessage(data);
          setLoggedIn(true);
          setLoginErrorMessage(false);
        }
        if (data.errorMessage) {
          setLoginMessage(false);
          setLoginErrorMessage(data);
        }
      })
      .catch((err) => {
        setLoginErrorMessage(err);
        console.log('oops something went wrong', err);
      });
  };

  return (
    <div className={classes.AppContainer}>
      {loggedIn ? (
        <>
          <Chatroom />
          {loginMessage ? setIntervalMessage() : null}
          {loginMessage ? (
            <h3 className={classes.SuccessMessage}>
              {loginMessage.successMessage}
            </h3>
          ) : null}
        </>
      ) : (
        <>
          <Login
            setSignInPassword={setSignInPassword}
            setSignInUsername={setSignInUsername}
            login={login}
            signInPassword={signInPassword}
            signInUsername={signInUsername}
          />

          {loginErrorMessage ? (
            <p className={classes.ErrorMessage}>
              {loginErrorMessage.errorMessage}
            </p>
          ) : null}

          <Signup
            setUsername={setUsername}
            setPassword={setPassword}
            createUsername={createUsername}
            username={username}
            password={password}
          />
          {signup ? <p>{signup.message}</p> : null}
          {signupError ? <p>{signupError.errors[0].msg}</p> : <p></p>}
        </>
      )}
    </div>
  );
};

export default App;