import React from 'react';
import Joiner from './Joiner';
import Prompter from './Prompter';
import IDer from './IDer';



function Recorder({room, userID, prompts, newRecorder, handleUpdateNewRec}) {
  let roomKey = '';
  if(room) roomKey = room.roomKey;

  return (
    <div className="recorder">
        { userID ? 
          <Prompter
            room={room}
            userID={userID}
            newRecorder={newRecorder}
            updateNewRec={handleUpdateNewRec}
            prompts={prompts}
          /> 
          : (roomKey !== '' ? <IDer room={room} /> : <Joiner />)}
    </div>
  );

}

export default Recorder;
