import React, { useState, useEffect, useRef } from 'react';
import classes from './Chatroom.module.css';

const Chatroom = ({ user, getAllMessages, setGetAllMessages, socket, io }) => {
  const [getMessages, setGetMessages] = useState();
  const [userMessage, setUserMessage] = useState('');
  const [getAllUsers, setGetAllUsers] = useState();
  const [flag, setFlag] = useState(false);
  const [personalMessage, setMessage] = useState();
  const [getnewMessage, setNewMessage] = useState([]);
  const [randomColor, setRandomColor] = useState(
    Math.floor(Math.random() * 16777215).toString(16)
  );

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // eslint-disable-next-line;
    fetch(`http://localhost:4000/getallusers`)
      .then((data) => data.json())
      .then((users) => {
        console.log('-----ALL USERS------', users);
        setGetAllUsers(users);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line;
    fetch(`http://localhost:4000/getuser/${user.username}/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setGetMessages(data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getUserInput = (e) => {
    setUserMessage(e.target.value);
    setMessage(e.target.value);
  };

  useEffect(() => {
    // eslint-disable-next-line;
    if (flag === true);
    fetch(`http://localhost:4000/getallmessages`)
      .then((data) => data.json())
      .then((messages) => {
        setGetAllMessages(messages);
        setFlag(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [flag]);

  useEffect(() => {
    scrollToBottom();
  }, [getAllMessages, flag]);

  const ioSendMessage = (e) => {
    console.log('went in ioSentMessage');
    e.preventDefault();
    const body = {
      userMessage: userMessage,
      user: user.username,
      userId: user.id,
    };

    fetch(`http://localhost:4000/sendmessage/${user.id}`, {
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
        console.log('success', message);
        setFlag(true);
        setUserMessage('');
      })
      .catch((err) => {
        console.log(err);
      });

    socket.emit('new_message', {
      username: user.username,
      message: userMessage,
    });

    socket.on('new_message', (message) => {
      setNewMessage(getnewMessage ? [...getnewMessage, message] : null);
      console.log(getnewMessage);
    });
  };

  if (
    user === undefined ||
    getMessages === undefined ||
    getAllMessages === undefined ||
    getAllUsers === undefined
  )
    return <p>loading..</p>;

  return (
    <div className={classes.ChatroomContainer}>
      <h1>Welcome {user ? user.username : 'Elita'}</h1>
      <div className={classes.ChatroomBox}>
        {getAllMessages.message.map((allMessages) => (
          <div key={allMessages.id}>
            <p>
              {getAllUsers.messages.map((user) =>
                user.id === allMessages.userId ? (
                  <span
                    key={user.id}
                    className={classes.UsernameColor}
                    //create a random color to differenciate users.
                    style={{
                      color: '#' + randomColor,
                    }}
                  >
                    {user.username} :
                  </span>
                ) : (
                  ''
                )
              )}
              {allMessages.message}
            </p>
            <div ref={messagesEndRef} />
          </div>
        ))}
        {getnewMessage
          ? getnewMessage.map((message) => (
              <p>
                <span>{message.username} </span>
                {message.message}
              </p>
            ))
          : null}

        <input type='hidden' name={user ? user.username : ''} />
        <input type='hidden' name={user ? user.id : ''} />
      </div>
      <div className={classes.SendMessageUI}>
        <input
          type='text'
          name='userMessage'
          placeholder='hi eli ;)'
          onChange={(e) => getUserInput(e)}
          onKeyDownCapture={(e) => (e.keyCode === 13 ? ioSendMessage(e) : null)}
          value={userMessage}
        ></input>
        <button onClick={ioSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatroom;
