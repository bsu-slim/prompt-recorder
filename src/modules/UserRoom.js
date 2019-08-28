import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Log from '../components/Log';
import Recorder from '../components/Recorder';
import Waiter from '../components/Waiter';
import socket from '../sockets/socket';
import { withRouter } from 'react-router-dom';
import { 
  cbDataRoom,
  cbNoRecorder,
  cbNewRecorder,
  cbNewRoom,
  cbListRoomPrompts,
  getRoomPrompts
} from '../sockets/read';
import { onReconnect } from '../sockets/socket';

import './Modules.css';

class UserRoom extends React.Component {

  constructor() {
    super();
    this.state = { 
      isNew: false,
      newRecorder: false,
      room: {
        roomID: -1,
        roomKey: '',
        active: 0,
        shuffle: 0,
        log: 0,
        created: ''
      },
      prompts: []
    };
    cbDataRoom(this.handleDataRoom);
    cbNoRecorder(this.handleNoRecorder);
    cbNewRecorder(this.handleNewRecorder);
    cbNewRoom(this.handleNewRoom);
    cbListRoomPrompts(this.handleListRoomPrompts);
    onReconnect(this.join);
  }

  handleNewRoom = (payload) => {
    if(this._ismounted)
      this.setState({isNew: payload});
  }
  handleDataRoom = (payload) => {
    if(this._ismounted)
      this.setState({room: payload}, this.GetPrompts);
  };
  
  handleListRoomPrompts = (payload) => {
    let prompts = payload;
    if(this.state.room.shuffle === 1) {
      prompts = this.shuffle(prompts);
    }
    if(this._ismounted)
      this.setState({prompts: prompts});
  };
  handleNoRecorder = (payload) => {
    if(payload.recorder)
       this.props.history.push('/'+payload.room);
  }
  handleNewRecorder = (payload) => {
    if(payload.recorderID) {
      if(this._ismounted)
        this.setState({newRecorder: true})
      this.props.history.push(`/${payload.room}/${payload.recorderID}`);
    }
  }

  handleUpdateNewRec = () => {
    if(this._ismounted)
        this.setState({newRecorder: !this.state.newRecorder});
  }

  shuffle = (array) => {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

  };

  join = () => {
    let match = this.props.match;
    let room = match.params.room;
    let userID = match.params.userID;
    let payload = { room: room, recorder: userID };
    socket.emit('join', payload);
    
  }

  GetPrompts = () => getRoomPrompts({roomID: this.state.room.roomID});

  componentDidMount() {
    this._ismounted = true;
    this.join();
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    let match = this.props.match;
    let room = match.params.room;
    let userID = match.params.userID;
    let isNew = this.state.isNew;
    let prompts = this.state.prompts;
    let log = this.state.room.log;
    let newRecorder = this.state.newRecorder;
    
    return (
      <div className="App">
        <Header as='h1' color='violet'>Prompt Recorder V2.0</Header>
        <Grid columns='equal' padded>
          <Grid.Column>
            {isNew ? 
              <Waiter room={room} /> 
              : <Recorder
                  room={this.state.room}
                  userID={userID}
                  newRecorder={newRecorder}
                  prompts={prompts}
                  handleUpdateNewRec={this.handleUpdateNewRec}
                />
            }
          </Grid.Column>
          { log === 1 ?
            (<Grid.Column>
              <Log />
            </Grid.Column>)
            : ''
          }
        </Grid>
      </div>
    );
  }
}

export default withRouter(UserRoom);
