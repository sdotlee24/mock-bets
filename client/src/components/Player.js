import React from 'react';


function Player(props) {

  return (
    <div className="Player">
      <h3>{props.fname}</h3>
      <h1>{props.lname}</h1>
      <h1>{props.num}</h1>
    </div>
  );
}

export default Player;