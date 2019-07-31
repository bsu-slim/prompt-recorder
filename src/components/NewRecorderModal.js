import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Header } from 'semantic-ui-react';

class newRecorderModal extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
      roomKey: ''
    }
  }

  onTrigger = () => {
    this.props.updateNewRec();
  }

  onCancel = () => {
    this.props.updateNewRec();
  }

  render() {
    return (
      <Modal
        open={this.props.newRecorder}
        size='tiny'
        dimmer='blurring'
        trigger={
          <Button
            onClick={this.onTrigger}
            color='blue'
            content='Whats My ID?'
            icon='help circle'
            labelPosition='right'
          />
          }
      >
        <Modal.Header>Your Recorder ID:</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Please write down the following ID and keep it. This is the only unique identifier for your data. Should you ever want a copy of your data, or have your data removed, this ID must be provided.</p>
            <Header as='h3' color='violet'>Your ID: {this.props.match.params.userID}</Header>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color='green'
            content='Okay'
            icon='check'
            labelPosition='right'
            onClick={this.onCancel}
          />
        </Modal.Actions>
      </Modal>
    );
  }

}

export default withRouter(newRecorderModal);