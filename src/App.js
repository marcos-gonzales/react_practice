import React, { useState } from 'react'
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

  const signIn = (e) => {
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
        <p>You are logged in!</p>
      ) : (
        <>
          <div className={classes.SignUpContainer}>
            <div>
              <h2>Sign up!</h2>
              <label>
                Username
                <input
                  type='text'
                  placeholder='John Wick'
                  name='username'
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                ></input>
              </label>
            </div>

            <div>
              <label>
                Password
                <input
                  type='password'
                  placeholder='gunsanddogs'
                  name='password'
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </label>
              <button
                onClick={createUsername}
                disabled={
                  username.length >= 3 && password.length >= 5 ? false : true
                }
              >
                Submit
              </button>
            </div>
          </div>

          {signup ? <p>{signup.message}</p> : null}
          {signupError ? <p>{signupError.errors[0].msg}</p> : <p></p>}

          <div className={classes.SignInContainer}>
            <h2>Sign in!</h2>
            <div>
              <label>
                Username
                <input
                  type='text'
                  placeholder='Oswald'
                  name='signInUsername'
                  onChange={(e) =>
                    setSignInUsername(e.target.value.toLowerCase())
                  }
                ></input>
              </label>
            </div>

            <div>
              <label>
                <input
                  type='password'
                  placeholder='iljulie'
                  name='signInPassword'
                  onChange={(e) => setSignInPassword(e.target.value)}
                ></input>
              </label>
              <button
                onClick={signIn}
                disabled={
                  signInUsername.length >= 3 && signInPassword.length >= 5
                    ? false
                    : true
                }
              >
                Submit
              </button>
            </div>
          </div>
          {message.successMessage ? (
            <h3 className={classes.SuccessMessage}>{message.successMessage}</h3>
          ) : (
            <h3 className={classes.ErrorMessage}>{message.errorMessage}</h3>
          )}
        </>
      )}
    </div>
  )
}

export default App
