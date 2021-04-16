import React from 'react';

import classes from './Login.module.css';

const Login = ({
  setSignInPassword,
  setSignInUsername,
  login,
  signInPassword,
  signInUsername,
}) => {
  const labelStyling = [classes.Label, ' grey-text'];

  return (
    <div>
      <h2 className='teal-text teal-lighten-2' style={{ marginTop: '60px' }}>
        Login in!
      </h2>
      <div>
        <label className={labelStyling[0] + labelStyling[1]}>
          Username
          <input
            className='white-text text-darken-2 input-field'
            type='text'
            placeholder='Oswald'
            name='signInUsername'
            onChange={(e) => setSignInUsername(e.target.value.toLowerCase())}
            onKeyDownCapture={(e) => (e.keyCode === 13 ? login(e) : null)}
          ></input>
        </label>
      </div>

      <div>
        <label className={labelStyling[0] + labelStyling[1]}>
          Password
          <input
            className='white-text text-darken-2 input-field'
            type='password'
            placeholder='iljulie'
            name='signInPassword'
            onKeyDownCapture={(e) => (e.keyCode === 13 ? login(e) : null)}
            onChange={(e) => setSignInPassword(e.target.value)}
          ></input>
        </label>
        <button
          className='btn-small brown darken-1 white-text waves-effect waves-light'
          onClick={login}
          disabled={
            signInUsername.length >= 3 && signInPassword.length >= 5
              ? false
              : true
          }
        >
          <i className='material-icons right'>chevron_right</i>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
