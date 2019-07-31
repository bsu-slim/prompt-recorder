import React from 'react';
import { Card, Header, Icon } from 'semantic-ui-react';
import { cbMessage } from '../sockets/read';

import { onDisconnect, onReconnect, onReconnectAttempt } from '../sockets/socket';


class Log extends React.Component {

  constructor() {
    super();
    this.state = { messages: [] };
    cbMessage(this.onNewMessage);
    onDisconnect(this.onDisconnect);
    onReconnect(this.onReconnect);
    onReconnectAttempt(this.onReconnectAttempt);
  }

  componentDidMount() { 
    this._ismounted = true;
  }
  
  componentWillUnmount() {
     this._ismounted = false;
  }

  onDisconnect = (reason) => {
    let payload = {
      message: `Client disconnected from server: ${reason}.`, 
      type:'error'
    }
    this.onNewMessage(payload);
  }
  onReconnect = (attempt) => {
    let payload = {
      message: `Client reconnected to server on attempt ${attempt}.`, 
      type:'success'
    }
    this.onNewMessage(payload);
  }
  onReconnectAttempt = (attempt) => {
    let payload = {
      message: `Client is attempting to reconnect to the server. Attempt: ${attempt}.`, 
      type:'warning'
    }
    this.onNewMessage(payload);
  }
  
  render() {
    const { messages } = this.state;
    return (
      <Card id='log' fluid color='green'>
        <Card.Content>
          <Card.Header>
          <Icon name='file alternate' />
            Application Log
          </Card.Header>
          <Card.Description id="log-scroll">
            { messages }
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

  onNewMessage = (payload) => {
    let messages = this.state.messages;
    switch(payload.type) {
      case 'success':
        messages.push(<Header as='h5' color='green' key={messages.length+1}><Header as='span' className='msg-time' color='violet'>{payload.time} </Header>{payload.message}</Header>);
        break;
      case 'error':
        messages.push(<Header as='h5' color='red' key={messages.length+1}><Header as='span'  className='msg-time' color='violet'>{payload.time} </Header>{payload.message}</Header>);
        break;
      case 'warning':
        messages.push(<Header as='h5' color='yellow' key={messages.length+1}><Header as='span' className='msg-time' color='violet'>{payload.time} </Header>{payload.message}</Header>);
        break;
      default:
        messages.push(<Header as='h5' color='violet' key={messages.length+1}><Header as='span' className='msg-time' color='violet'>{payload.time} </Header>{payload.message}</Header>);
        break;
    }
    if(this._ismounted) {
      this.setState({messages: messages}, () => {
        let element = document.getElementById('log-scroll');
        element.scrollTop = element.scrollHeight;
      });
    }
  }

}

export default Log;
