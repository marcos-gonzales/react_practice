import React from 'react'

import classes from './Login.module.css'

const Login = ({
  setSignInPassword,
  setSignInUsername,
  login,
  signInPassword,
  signInUsername,
}) => {
  return (
    <div className={classes.SignInContainer}>
      <h2>Login in!</h2>
      <div>
        <label>
          Username
          <input
            type='text'
            placeholder='Oswald'
            name='signInUsername'
            onChange={(e) => setSignInUsername(e.target.value.toLowerCase())}
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
          onClick={login}
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
  )
}

export default Login
