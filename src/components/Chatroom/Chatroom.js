import React, { useState, useEffect } from 'react';
import classes from './Chatroom.module.css';

const Chatroom = ({ user }) => {
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:4000/getuser/${user.username}/${user.id}`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return (
    <div className={classes.ChatroomContainer}>
      <div className={classes.ChatroomBox}>
        <h1>Hi from chatroom</h1>
        <input type='hidden' name={user ? user.username : ''} />
        <input type='hidden' name={user ? user.id : ''} />
      </div>
    </div>
  );
};

export default Chatroom;
