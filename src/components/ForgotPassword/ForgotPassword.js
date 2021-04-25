import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const ForgotPassword = ({
  emailValue,
  setEmailValue,
  sendUserEmail,
  setUserEMail,
  resetPassword,
  token,
  user,
  setResetPasswordFlag,
}) => {
  const [tokenUserEntered, setTokenUserEntered] = useState('');
  const [newPasswordForm, setNewPasswordForm] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [incorrectToken, setIncorrectToken] = useState(false);
  const [passwordChangedMessage, setPasswordChangedMessage] = useState();

  const verifyTokens = () => {
    console.log(token);
    console.log(tokenUserEntered);
    if (token === tokenUserEntered) {
      setNewPasswordForm(true);
      setIncorrectToken(false);
    } else {
      setIncorrectToken(true);
    }
  };

  const submitNewPassword = () => {
    const body = {
      newPassword: newPasswordValue,
      user: user,
    };

    fetch(`https://chatroom-express-db.herokuapp.com/resetpassword/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((data) => data.json())
      .then((changedPassword) => setPasswordChangedMessage(changedPassword));
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
        <div>
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
            <label style={{ fontSize: '1.2rem' }}>
              Token
              <input
                className='grey-text text-lighten-5'
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

      {incorrectToken ? (
        <p className='grey-text text-lighten-5' style={{ fontSize: '1.2rem' }}>
          The token you entered doesn't match..
        </p>
      ) : null}

      {newPasswordForm ? (
        <div>
          <div>
            <label style={{ fontSize: '1.2rem' }}>
              New Password
              <input
                className='grey-text text-lighten-5'
                type='text'
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
        </div>
      ) : null}
      {passwordChangedMessage ? (
        <>
          <p
            className='green-text  text-lighten-1'
            style={{ fontSize: '1.2rem' }}
          >
            {passwordChangedMessage.message}
          </p>
        </>
      ) : null}
      {passwordChangedMessage
        ? setTimeout(() => {
            setResetPasswordFlag(false);
          }, 3500)
        : null}
    </div>
  );
};

export default ForgotPassword;
