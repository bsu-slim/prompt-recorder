import React from 'react';
import { Card, Header, Loader, Icon } from 'semantic-ui-react';
import Stepper from './Stepper';
import Controls from './Controls';
import socket from '../sockets/socket';
import { withRouter } from 'react-router-dom';

class Prompter extends React.Component {

  componentDidMount() {
    this.join();
  }

  join = () => {
    let match = this.props.match;
    let room = match.params.room;
    let userID = match.params.userID;
    let payload = { room: room, recorder: userID };
    socket.emit('join', payload); 
  }

  render(){

    let admin = this.props.admin;
    let room = this.props.room;
    let userID = this.props.userID;
    let prompts = this.props.prompts;
    let newRecorder = this.props.newRecorder;
    let updateNewRec = this.props.updateNewRec;

    let stepper = <Stepper steps={[
      {state: 'completed', title: 'Join a Room', description: 'Enter a room to join', href: '/'},
      {state: 'completed', title: 'Provide an ID', description: 'Identify the recorder', href: '/'+room.roomKey },
      {state: 'active', title: 'Record', description: 'Record prompt readings', href: '#'}
    ]} />;

    return (
      <Card fluid color='violet'>
        <Card.Content>
        {admin ? '':stepper}
          <Card.Header>
            <Icon name='microphone' />
            Recording Prompts In Room 
            <Header as='span' color='violet'>"{room.roomKey}"</Header>
            as Recorder 
            <Header as='span' color='violet'>"{userID}"</Header>
            
          </Card.Header>
          <Card.Description>
            {
              this.props.room.active === 0 ? 
              <div className="loader">
                <Loader active size='massive' />
                Please wait for room to be activated...
              </div> 
              : <Controls prompts={prompts} room={room} newRecorder={newRecorder} updateNewRec={updateNewRec} />
            }
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default withRouter(Prompter);
