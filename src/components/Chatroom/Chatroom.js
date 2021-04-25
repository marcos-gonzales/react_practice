import React, { useState, useEffect, useRef } from 'react';
import ReactTimeAgo from 'react-time-ago';
import classes from './Chatroom.module.css';

const Chatroom = ({
  user,
  getAllMessages,
  setGetAllMessages,
  socket,
  io,
  userThatSignedUp,
  userFlag,
  date,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [getMessages, setGetMessages] = useState();
  const [userMessage, setUserMessage] = useState('');
  const [getAllUsers, setGetAllUsers] = useState();
  const [flag, setFlag] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [personalMessage, setMessage] = useState();
  const [getnewMessage, setNewMessage] = useState([]);
  const [_typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState({});
  const messagesEndRef = useRef(null);

  const ENDPOINTPRODUCTION = 'https://chatroom-express-db.herokuapp.com';
  const ENDPOINTDEV = 'http://localhost:4000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetch(`${ENDPOINTPRODUCTION}/getallusers`)
      .then((data) => data.json())
      .then((users) => {
        setGetAllUsers(users);
      })
      .catch((err) => console.log(err));
  }, [socket]);

  useEffect(() => {
    setTimeout(() => {
      if (userFlag) {
        fetch(
          `${ENDPOINTPRODUCTION}/getuser/${userThatSignedUp.user.username}/${userThatSignedUp.user.id}`
        )
          .then((response) => response.json())
          .then((data) => {
            setGetMessages(data.message);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        fetch(`${ENDPOINTPRODUCTION}/getuser/${user.username}/${user.id}`)
          .then((response) => response.json())
          .then((data) => {
            setGetMessages(data.message);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserInput = (e) => {
    setTyping(true);
    setUserMessage(e.target.value);
    setMessage(e.target.value);
    if (userFlag) {
      socket.emit('typing', userThatSignedUp.user);
    } else {
      socket.emit('typing', user);
    }

    socket.on('typing', (typing) => {
      if (typing) {
        setTyping(true);
        setUserTyping(typing);
        setTimeout(() => {
          setTyping(false);
        }, 3000);
      }
    });
  };

  useEffect(() => {
    console.log('use effect is in use.');
    if (flag === true);
    fetch(`${ENDPOINTPRODUCTION}/getallmessages`)
      .then((data) => data.json())
      .then((messages) => {
        setGetAllMessages(messages);
        setFlag(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag, getnewMessage, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [getAllMessages, flag]);

  const ioSendMessage = (e) => {
    let body;
    e.preventDefault();

    if (userFlag) {
      body = {
        userMessage: userMessage,
        user: userThatSignedUp.username,
        userId: userThatSignedUp.id,
      };
    } else {
      body = {
        userMessage: userMessage,
        user: user.username,
        userId: user.id,
      };
    }

    if (userFlag) {
      //redirect user to chatroom is user signs up.
      fetch(`${ENDPOINTPRODUCTION}/sendmessage/${userThatSignedUp.user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((data) => {
          return data.json();
        })
        .then((message) => {
          setFlag(true);
          setUserMessage('');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //login in regulaur way.
      fetch(`${ENDPOINTPRODUCTION}/sendmessage/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((data) => {
          return data.json();
        })
        .then((message) => {
          setFlag(true);
          setUserMessage('');
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (userFlag) {
      socket.emit('new_message', {
        username: userThatSignedUp.user.username,
        message: userThatSignedUp.user.userMessage,
      });
    } else {
      socket.emit('new_message', {
        username: user.username,
        message: userMessage,
      });
    }

    socket.on('new_message', (message) => {
      setNewMessage(message);
    });
  };

  if (!getAllMessages || !getAllUsers)
    return <h1 className='grey-text text-lighten-2'>loading...</h1>;

  return (
    <div className='container'>
      <h4 className='white-text'>
        Welcome {user ? user.username : userThatSignedUp.user.username}
      </h4>
      <div className={classes.ChatroomBox}>
        {getAllMessages.message.map((allMessages) => (
          <div key={allMessages.id}>
            <p className='flow-text'>
              {getAllUsers.messages.map((user) =>
                user.id === allMessages.userId ? (
                  <span key={user.id} className={classes.UsernameColor}>
                    {user.username}:
                  </span>
                ) : (
                  ''
                )
              )}
              {allMessages.message}
              {allMessages.createdAt ? (
                <span
                  className='grey-text text-darken-1'
                  style={{ paddingLeft: '10px', fontSize: '1.2rem' }}
                >
                  <ReactTimeAgo date={allMessages.createdAt} locale='en-US' />
                </span>
              ) : null}
            </p>
            <div ref={messagesEndRef} />
          </div>
        ))}

        <input type='hidden' name={user ? user.username : ''} />
        <input type='hidden' name={user ? user.id : ''} />
        {/* <input type='hidden' name={user ? user.email : ''} /> */}
      </div>

      {_typing ? (
        <span
          style={{ position: 'absolute', marginTop: '-15px' }}
          className='white-text left'
        >
          {userTyping.username} is typing...
        </span>
      ) : null}

      <div className='row'>
        <div className='col s10'>
          <input
            className='white-text'
            type='text'
            name='usermessage'
            placeholder='hi eli ;)'
            onChange={(e) => getUserInput(e)}
            onKeyDownCapture={(e) =>
              e.keyCode === 13 && userMessage.length >= 1
                ? ioSendMessage(e)
                : null
            }
            value={userMessage}
          ></input>
        </div>
        <div>
          <button
            className='btn brown darken-2 white-text waves-effect waves-light valign-wrapper col s2'
            onClick={ioSendMessage}
            disabled={userMessage.length >= 1 ? false : true}
          >
            <i className='material-icons'>chat</i>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
