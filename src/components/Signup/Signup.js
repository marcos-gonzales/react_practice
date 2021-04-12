import React from 'react';

import classes from './Signup.module.css';

const Signup = ({
  setUsername,
  setPassword,
  createUsername,
  username,
  password,
}) => {
  const labelStyling = [classes.Label, ' grey-text'];

  return (
    <div className={classes.SignUpContainer}>
      <div>
        <h2 className='teal-text teal-lighten-2'>Sign up!</h2>
        <label className={labelStyling[0] + labelStyling[1]}>
          Username
          <input
            className='white-text text-darken-2 input-field'
            type='text'
            placeholder='John Wick'
            name='username'
            onKeyDownCapture={(e) =>
              e.keyCode === 13 ? createUsername(e) : null
            }
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
          ></input>
        </label>
      </div>

      <div>
        <label>
          Password
          <input
            className='white-text text-darken-2 input-field'
            type='password'
            placeholder='gunsanddogs'
            name='password'
            onChange={(e) => setPassword(e.target.value)}
            onKeyDownCapture={(e) =>
              e.keyCode === 13 ? createUsername(e) : null
            }
          ></input>
        </label>
        <button
          className='btn-small brown darken-1 white-text waves-effect waves-light'
          onClick={createUsername}
          disabled={username.length >= 3 && password.length >= 5 ? false : true}
        >
          <i className='material-icons right'>send</i>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Signup;
