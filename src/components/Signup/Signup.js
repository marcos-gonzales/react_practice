import React from 'react'

import classes from './Signup.module.css'

const Signup = ({
  setUsername,
  setPassword,
  createUsername,
  username,
  password,
}) => {
  return (
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
          disabled={username.length >= 3 && password.length >= 5 ? false : true}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default Signup
