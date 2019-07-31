import React from 'react';
import path from 'path';
import { withRouter } from 'react-router-dom';
import { Card, Form, Button, Divider, Header, Dropdown } from 'semantic-ui-react';
import Stepper from './Stepper';
import { createRecorder } from '../sockets/create';

class IDer extends React.Component {
  
  constructor() {
    super();
    this.state = {
      recorderID: '',
      recorderGender: '',
      recorderAge: ''
    };
  }

  onIDChange = (e, { value }) => this.setState({ recorderID: value });
  onAgeChange = (e, { value }) => this.setState({ recorderAge: value});
  onGenderChange = (e, { value }) => this.setState({ recorderGender: value});

  onJoin = () => {
    let id = this.state.recorderID;
    if(id && id !== '' && id.match(/^[\d+]*$/)) {
      this.props.history.push(path.join(window.location.pathname, id));
    }
  }

  onCreateRecorder = () => {
    let payload = {
      recorderAge: this.state.recorderAge, 
      recorderGender: this.state.recorderGender, 
      room: this.props.room.roomKey
    };
    createRecorder(payload);
  }

  render() {
    const { recorderGender, recorderID, recorderAge } = this.state;
    let stepper = <Stepper steps={[
      {state: 'completed', title: 'Join a Room', description: 'Enter a room to join', href: '/'},
      {state: 'active', title: 'Provide an ID', description: 'Identify the recorder', href: '#' },
      {state: 'disabled', title: 'Record', description: 'Record prompt readings', href: '#'}
    ]} />;

    return (
      <Card fluid color='violet'>
        <Card.Content>
          {stepper}
          <Card.Description>
            <Header as='h3' color='violet'>Enter a Recorder ID:</Header>
            <Form onSubmit={this.onJoin}>
                <Form.Field width={16}>
                  <label>Existing Recorder ID:</label>
                  <Form.Input 
                    placeholder='00005'
                    name='room'
                    type='number'
                    value={ recorderID }
                    onChange={this.onIDChange}
                    action={{ 
                      color: 'violet',
                      labelPosition: 'right', 
                      icon: 'arrow circle right', 
                      content: 'Verify & Begin Recording',
                      type: 'sumbit'
                    }}
                  />
                </Form.Field>
            </Form>
            <Divider horizontal>Or</Divider>
            <Header as='h3' color='violet'>Create a new ID:</Header>
            <Form onSubmit={this.onCreateRecorder}>
              <Form.Group>
                <Form.Field width={8}>
                  <label>Recorder Age (years):</label>
                  <Form.Input 
                    placeholder='12'
                    name='room'
                    type='number'
                    value={recorderAge}
                    onChange={this.onAgeChange}
                  />
                </Form.Field>
                <Form.Field width={8}>
                  <label>Recorder Gender:</label>
                  <Dropdown
                    placeholder='Select Gender'
                    fluid
                    selection
                    name='gender'
                    value={recorderGender}
                    onChange={this.onGenderChange}
                    options={[
                      {key: 'Male', text: 'Male', value: 'Male'},
                      {key: 'Female', text: 'Female', value: 'Female'},
                      {key: 'Unspecified', text: 'Unspecified', value: 'Unspecified'}
                    ]}
                  />
                </Form.Field>
              </Form.Group>
              <Button 
                color='green'
                type='submit'
                labelPosition='right'
                icon='plus circle'
                content='Create & Begin Recording'
                floated='right'
              />
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default withRouter(IDer);
