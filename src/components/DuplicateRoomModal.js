import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Form } from 'semantic-ui-react';
import { duplicateRoom } from '../sockets/create';

class DuplicateRoomModal extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
      roomKey: ''
    }
  }

  onCreate = () => {
    //console.log('TODO: Duplicate room');
    this.setState({open: false, roomKey: ''});
    duplicateRoom({room: this.props.room, copy: this.state.roomKey})
  }

  onTrigger = () => {
    this.setState({open: true});
  }

  onCancel = () => {
    this.setState({open: false, roomKey: ''});
  }

  onRoomKeyChange = (e) => {
    this.setState({roomKey: e.target.value});
  }

  render() {
    let roomKey = this.state.roomKey;
    return (
      <Modal
        open={this.state.open}
        size='tiny'
        dimmer='blurring'
        trigger={
          <Button
            onClick={this.onTrigger}
            color='violet'
            content='Duplicate'
            icon='copy'
            labelPosition='right'
          />
          }
      >
        <Modal.Header>Please Provide An Existing Room...</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Using the duplicate feature, you may provide the name of an existing room to have all of the prompts from that room copied into a new room. Provide an existing room key below to get started.</p>
            <Form id="room-name-copy">
              <Form.Field width={16}>
                <label>Existing Room Key:</label>
                <Form.Input 
                  placeholder='Room Name ...'
                  name='room'
                  type='text'
                  value={ roomKey }
                  onChange={this.onRoomKeyChange}
                />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='yellow'
            content='Cancel'
            icon='close'
            labelPosition='right'
            onClick={this.onCancel}
          />
          <Button
            color='green'
            content='Duplicate'
            icon='checkmark'
            labelPosition='right'
            onClick={this.onCreate}
          />
        </Modal.Actions>
      </Modal>
    );
  }

}

export default withRouter(DuplicateRoomModal);