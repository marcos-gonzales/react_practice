import React, { useState, useEffect } from 'react';
import classes from './Chatroom.module.css';

const Chatroom = ({ user }) => {
  const [getMessages, setGetMessages] = useState();
  const [userMessage, setUserMessage] = useState('');
  const [getAllMessages, setGetAllmessages] = useState();
  useEffect(() => {
    console.log(user);
    fetch(`http://localhost:4000/getallusers`)
      .then((data) => data.json())
      .then((messages) => {
        console.log(messages);
        setGetAllmessages(messages);
      });
  }, []);

  useEffect(() => {
    console.log(user);
    fetch(`http://localhost:4000/getuser/${user.username}/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGetMessages(data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const body = {
      userMessage: userMessage,
      user: user.username,
    };
    fetch(`http://localhost:4000/postsendmessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  if (user === undefined || getMessages === undefined) {
    return <h1>loading...</h1>;
  } else {
    return (
      <div className={classes.ChatroomContainer}>
        <h1>Welcome {user ? user.username : 'Elita'}</h1>
        <div className={classes.ChatroomBox}>
          {getMessages.map((message) => (
            <div key={message.id}>
              <p>{message.message}</p>
            </div>
          ))}
          <input type='hidden' name={user ? user.username : ''} />
          <input type='hidden' name={user ? user.id : ''} />
          <input
            type='text'
            name='userMessage'
            placeholder='hi eli ;)'
            onChange={(e) => setUserMessage(e.target.value)}
          ></input>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    );
  }
};

export default Chatroom;
