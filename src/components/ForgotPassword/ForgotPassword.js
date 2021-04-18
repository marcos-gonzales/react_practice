import React, { useState, useEffect } from 'react';

const ForgotPassword = ({
  emailValue,
  setEmailValue,
  sendUserEmail,
  setUserEMail,
  resetPassword,
  token,
  user,
}) => {
  const [tokenUserEntered, setTokenUserEntered] = useState('');
  const [newPasswordForm, setNewPasswordForm] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  const verifyTokens = () => {
    console.log(token);
    console.log(tokenUserEntered);
    if (token === tokenUserEntered) {
      console.log('trueee');
      setNewPasswordForm(true);
    } else {
      console.log('falseee');
    }
  };

  const submitNewPassword = () => {
    const body = {
      newPassword: newPasswordValue,
      user: user,
    };

    fetch(`http://localhost:4000/resetpassword/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  return (
    <div className='container' style={{ marginTop: '60px' }}>
      <h4 className='teal-text text-teal-lighten-2'>Reset Passsword</h4>
      <p className='grey-text text-lighten-2' style={{ fontSize: '1.2rem' }}>
        Enter you e-mail address and if you have an account we will send you a
        password reset token.
      </p>
      <label style={{ fontSize: '1.2rem' }}>
        Email
        {/* Remind user email needs an @ and period  */}
        {emailValue.length >= 4 ? (
          <p className='yellow-text text-yellow-accent-1'>
            Email must contain '@' and '.'
          </p>
        ) : null}
        <input
          className='grey-text text-lighten-5'
          type='email'
          name='email'
          onChange={(e) => setEmailValue(e.target.value)}
        ></input>
      </label>
      <button
        className='btn-small brown darken-1 white-text waves-effect waves-light'
        disabled={
          emailValue.length >= 1 &&
          emailValue.includes('@') &&
          emailValue.includes('.')
            ? false
            : true
        }
        onClick={resetPassword}
      >
        Submit
      </button>

      {sendUserEmail ? (
        <div className='container'>
          <div>
            <h5 className='yellow-text text-yellow-accent-1'>
              If you have an account with us we have just sent you an email to
              reset you password.{' '}
              <span>
                Check your spam folder if you haven't received within a minute
                or two.
              </span>
              <p>Enter the access token in the form below.</p>
            </h5>
          </div>
          <div>
            <label>
              Token
              <input
                type='text'
                onChange={(e) => setTokenUserEntered(e.target.value)}
              ></input>
              <button
                className='btn-small brown darken-1 white-text waves-effect waves-light'
                onClick={verifyTokens}
              >
                Submit
              </button>
            </label>
          </div>
        </div>
      ) : null}

      {newPasswordForm ? (
        <div>
          <label>
            New Password
            <input
              type='input'
              name='newpassword'
              onChange={(e) => setNewPasswordValue(e.target.value)}
            ></input>
          </label>
          <button
            className="btn-small brown darken-1 white-text waves-effect waves-light'"
            onClick={submitNewPassword}
          >
            Submit
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ForgotPassword;
