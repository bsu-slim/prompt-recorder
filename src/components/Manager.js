import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Header, Tab, Icon, Button } from 'semantic-ui-react';
import Prompts from './Prompts';
import Settings from './Settings';
import Importer from './Importer';
import Recordings from './Recordings';

import { 
  cbDataRoom,
  cbDataPrompt,
  cbDataPromptList,
  cbListPrompts,
  cbListRoomRecordings,
  getPromptList,
  getRoomRecordingList
} from '../sockets/read';

import {
  cbReloadRoomRecording
} from '../sockets/update';

class Manager extends React.Component {
  
  constructor() {
    super();
    this.state = {
      settings: {
        roomID: -1,
        roomKey: '',
        active: false,
        shuffle: false,
        created: ''
      },
      prompts: [],
      searchString: '',
      recordings: []
    }
    cbDataRoom(this.handleDataRoom);
    cbDataPrompt(this.handleDataPrompt);
    cbListPrompts(this.handleListPrompts);
    cbDataPromptList(this.handleDataPromptList);
    cbListRoomRecordings(this.handleListRoomRecordings);
    cbReloadRoomRecording(this.handleReloadRecordings);
  }

  componentDidMount() { 
    this._ismounted = true;
  }
  
  componentWillUnmount() {
     this._ismounted = false;
  }

  handleDataRoom = (room) => {
    if(this._ismounted)
      this.setState({settings: room}, this.init)
  };
  handleListPrompts = (payload) => {
    if(this._ismounted)
      this.setState({prompts: payload});
  };
  handleListRoomRecordings = (payload) => {
    if(this._ismounted)
      this.setState({recordings: payload})
  };
  handleReloadRecordings = (payload) => this.loadRecordings();
  handleDataPrompt = (prompt) => {
    let prompts = this.state.prompts;
    prompts.push(prompt);
    if(this._ismounted)
      this.setState({prompts: prompts});
  }
  

  init = () => {
    this.loadPrompts();
    this.loadRecordings();
  }

  handleDataPromptList = (promptlist) => this.sendSearch;

  loadPrompts = () => {
    let payload = {
      roomID: this.state.settings.roomID
    }
    getPromptList(payload);
  }

  loadRecordings = () => {
    let payload = {
      roomID: this.state.settings.roomID,
      room: this.state.settings.roomKey
    }
    getRoomRecordingList(payload);
  }

  sendSearch = () => {
    let payload = {
      roomID: this.state.settings.roomID
    }
    if(this.state.searchString !== '') 
      payload.search = this.state.searchString;

    getPromptList(payload);
  }

  onUpdateSearch = (e, {value}) => this.setState({searchString: value}, this.sendSearch);

  onQuit = (e) => this.props.history.push('/admin');

  render() {
    let settings = this.state.settings;
    let room = this.state.settings.roomKey;
    let languages = this.props.languages;
    let prompts = this.state.prompts;
    let recordings = this.state.recordings;
    
    let panes = [
      { 
        menuItem: { key: 'settings', icon: 'settings', content: 'Settings'}, 
        render: () => 
          <Tab.Pane attached={false}>
            <Settings
              room={room}
              settings={settings}
            />
          </Tab.Pane>
      },
      { 
        menuItem: { key: 'prompts', icon: 'write', content: 'Prompts'}, 
        render: () => 
          <Tab.Pane attached={false}>
            <Prompts 
              room={room}
              settings={settings}
              prompts={prompts}
              search={this.state.searchString}
              sendSearch={this.sendSearch}
              onUpdateSearch={this.onUpdateSearch}
            />
          </Tab.Pane>
      },
      { 
        menuItem: { key: 'recordings', icon: 'microphone', content: 'Recordings'}, 
        render: () => 
          <Tab.Pane attached={false}>
            <Recordings 
              room={room}
              settings={settings}
              prompts={prompts}
              recordings={recordings}
              search={this.state.searchString}
              sendSearch={this.sendSearch}
              onUpdateSearch={this.onUpdateSearch}
            />
          </Tab.Pane>
      },
      { 
        menuItem: { key: 'import', icon: 'upload', content: 'Import'}, 
        render: () => 
          <Tab.Pane attached={false}>
            <Importer 
              languages={languages}
              room={settings}
            />
          </Tab.Pane>
      },
      { 
        menuItem: { key: 'export', icon: 'download', content: 'Export'}, 
        render: () => <Tab.Pane attached={false}><Header as='h1' color='violet'>Coming soon...</Header></Tab.Pane>
      }
    ];

    return (
      <Card fluid color='violet'>
        <Card.Content>
          <Card.Header>
            <Icon name='cog' />
            Managing Room: <Header as='span' color='violet'>"{room}"</Header>
            <Button 
              floated='right'
              size='mini'
              icon='close'
              color='red'
              onClick={this.onQuit}
            />

          </Card.Header>
          <Card.Description>
            <Tab menu={{ color: 'violet', borderless: true, pointing: true }} panes={panes} />
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

}

export default withRouter(Manager);
