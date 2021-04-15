import React, { useState, useEffect } from 'react';

import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Chatroom from './components/Chatroom/Chatroom';
import classes from './App.module.css';

import { io } from 'socket.io-client';
const ENDPOINT = 'http://localhost:4000';
var socket = io(ENDPOINT, { forceNew: true });

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loginMessage, setLoginMessage] = useState();
  const [loginErrorMessage, setLoginErrorMessage] = useState();
  const [signup, setupSignup] = useState();
  const [signupError, setSignupError] = useState();
  const [user, setUser] = useState();
  const [getAllMessages, setGetAllMessages] = useState();
  const h1Styling = [classes.Welcome, ' center teal-text text-teal-lighten-2'];
  const [userThatSignedUp, setUserThatSignedUp] = useState();
  const [userFlag, setUserFlag] = useState(false);

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
      email: email,
    };

    fetch('https://chatroom-express-db.herokuapp.com/createuser', {
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
          setUserFlag(true);
          setUserThatSignedUp(data);
          setupSignup(data);
          setSignupError(false);
          setLoggedIn(true);
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

    fetch('https://chatroom-express-db.herokuapp.com/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.successMessage) {
          setUser(data.user);
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

  useEffect(() => {
    fetch(`https://chatroom-express-db.herokuapp.com/getallmessages`)
      .then((data) => data.json())
      .then((messages) => {
        setGetAllMessages(messages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className='container'>
      {loggedIn ? (
        <>
          {loginMessage ? setIntervalMessage() : null}
          {loginMessage ? (
            <h3 className={classes.SuccessMessage}>
              {loginMessage.successMessage}
            </h3>
          ) : null}

          <Chatroom
            user={user}
            getAllMessages={getAllMessages}
            setGetAllMessages={setGetAllMessages}
            socket={socket}
            io={io}
            userThatSignedUp={userThatSignedUp}
            userFlag={userFlag}
          />
        </>
      ) : (
        <>
          <h1 className='center teal-text text-teal-lighten-2'>Welcome to</h1>
          <h1 className={h1Styling[0] + h1Styling[1]}>
            <span className='#000000 black'>Chat.io</span>
          </h1>
          <Login
            setSignInPassword={setSignInPassword}
            setSignInUsername={setSignInUsername}
            login={login}
            signInPassword={signInPassword}
            signInUsername={signInUsername}
          />

          {loginErrorMessage ? (
            <p className='white-text'>{loginErrorMessage.errorMessage}</p>
          ) : null}

          <Signup
            setUsername={setUsername}
            setPassword={setPassword}
            createUsername={createUsername}
            username={username}
            password={password}
            email={email}
            setEmail={setEmail}
          />
          {signup ? <p className='white-text'>{signup.message}</p> : null}
          {signupError ? (
            <p className='white-text'>{signupError.errors[0].msg}</p>
          ) : (
            <p></p>
          )}
        </>
      )}
    </div>
  );
};

export default App;
