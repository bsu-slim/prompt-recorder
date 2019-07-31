import React from 'react';
import path from 'path';
import { withRouter } from 'react-router-dom';
import { Card, Form, Input, Header } from 'semantic-ui-react';
import Stepper from './Stepper';




class Joiner extends React.Component {

  onJoin = (e) => {
    let room = e.target[0].value;
    if(room && room !== '' && !room.includes('admin') && !room.includes('Admin') && room.match(/^[-_.\w\s]*$/)) {
      this.props.history.push(path.join(window.location.pathname, room));
    }
  }

  render() {
    let admin = this.props.admin;
    let stepper = (<Stepper steps={[
      {state: 'active', title: 'Join a Room', description: 'Enter a room to join', href: '/'},
      {state: 'disabled', title: 'Provide an ID', description: 'Identify the recorder', href: '#' },
      {state: 'disabled', title: 'Record', description: 'Record prompt readings', href: '#'}
    ]} />);

    return (
      <Card fluid color='violet'>
        <Card.Content>
          {admin ? '':stepper}
          <Card.Description>
          <Header as='h3' color='violet'>Join A Room:</Header>
            <Form onSubmit={this.onJoin}>
              <Form.Group>
                <Form.Field width={16}>
                  <label>Room Name:</label>
                  <Input 
                    placeholder='myRoom1234'
                    name='room'
                    id='room'
                    action={{ 
                      color: 'violet',
                      labelPosition: 'right', 
                      icon: 'arrow circle right', 
                      content: 'Join Room',
                      type: 'sumbit'
                    }}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}



export default withRouter(Joiner);
