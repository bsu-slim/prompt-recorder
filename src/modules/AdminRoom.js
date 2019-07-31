import React from 'react';
import { Grid, Header} from 'semantic-ui-react';
import Log from '../components/Log';
import Manager from '../components/Manager';
import NewRoomModal from '../components/NewRoomModal';
import socket from '../sockets/socket';
import { cbDataRoom, cbNewRoom, cbListLanguages } from '../sockets/read';
import { onReconnect } from '../sockets/socket';
import './Modules.css';

class AdminRoom extends React.Component {
  
  constructor() {
    super();
    this.state = { isNew: false, active: 0, roomID: -1, languages: [] };
    cbDataRoom(this.handleDataRoom);
    cbNewRoom(this.handleNewRoom);
    cbListLanguages(this.handleListLanguages);
    onReconnect(this.join);
  }

  handleNewRoom = (payload) => {
    if(this._ismounted)
      this.setState({isNew: payload});
  }

  handleDataRoom = (payload) => {
    if(this._ismounted)
      this.setState({
        isNew: false,
        active: payload.active,
        roomID: payload.roomID
      });
  }

  handleListLanguages = (payload) => {
    if(this._ismounted)
      this.setState({languages: payload});
  }


  componentDidMount() {
    this._ismounted = true;
    this.join();
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  join = () => {
    let match = this.props.match;
    let room = match.params.room;
    let payload = { room: room };
    socket.emit('joinAdmin', payload);
  }

  render() {
    let room = this.props.match.params.room;
    let isNew = this.state.isNew;
    let languages = this.state.languages;

    return (
      <div className="App">
        <Header as='h1' color='violet'>Prompt Recorder V2.0 Admin Panel</Header>
        <Grid columns='equal' padded>
          <Grid.Column>
            <NewRoomModal room={room} open={isNew} />
            <Manager room={room} languages={languages} />
          </Grid.Column>
          <Grid.Column>
            <Log />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminRoom;
