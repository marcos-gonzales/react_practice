import React, { useState } from 'react'

import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'

import classes from './App.module.css'

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signInUsername, setSignInUsername] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [message, setMessage] = useState({})
  const [signup, setupSignup] = useState()
  const [signupError, setSignupError] = useState()

  const createUsername = (e) => {
    e.preventDefault()
    const body = {
      username: username,
      password: password,
    }

    fetch('http://localhost:4000/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'THIS IS IN DATA')
        if (data.message) {
          setupSignup(data)
          setSignupError(false)
        }
        if (data.errors) {
          setSignupError(data)
        }
      })
      .catch((err) => {
        console.log(err, 'THIS IS IN ERROR')
        if (err.message) {
          setupSignup(err)
        }
        if (err.errors) {
          setSignupError(err)
        }
      })
      .finally((lastStep) => {
        console.log('reached here')
      })
  }

  const login = (e) => {
    e.preventDefault()
    const body = {
      signInUsername: signInUsername,
      signInPassword: signInPassword,
    }

    fetch('http://localhost:4000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'sent data.')
        setMessage(data)
      })
      .catch((err) => {
        setMessage(err)
        console.log('oops something went wrong', err)
      })
      .finally(() => {
        console.log(message)
      })
  }

  return (
    <div className={classes.AppContainer}>
      {loggedIn ? (
        <>
          <p>You are logged in.</p>
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
          {message.successMessage ? (
            <h3 className={classes.SuccessMessage}>{message.successMessage}</h3>
          ) : (
            <h3 className={classes.ErrorMessage}>{message.errorMessage}</h3>
          )}
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
  )
}

export default App
