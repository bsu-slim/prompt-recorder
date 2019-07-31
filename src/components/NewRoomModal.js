import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'semantic-ui-react';
import { createRoom } from '../sockets/create';
import DuplicateRoomModal from './DuplicateRoomModal';

class NewRoomModal extends React.Component {

  onCreate = () => {
    createRoom({room: this.props.room});
  }

  onCancel = () => {
    this.props.history.push('/admin')
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        size='tiny'
        dimmer='blurring'
      >
        <Modal.Header>The Room '{this.props.room}' Does Not Exist Yet...</Modal.Header>
        <Modal.Content>
          <Modal.Description>Do you wish to create the room '{this.props.room}'?</Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='yellow'
            content='Cancel'
            icon='close'
            labelPosition='right'
            onClick={this.onCancel}
          />
          <DuplicateRoomModal room={this.props.room} />
          <Button
            color='green'
            content='Create'
            icon='checkmark'
            labelPosition='right'
            onClick={this.onCreate}
          />
        </Modal.Actions>
      </Modal>
    );
  }

}

export default withRouter(NewRoomModal);