import React from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import Player from './Player';
import NewRecorderModal from './NewRecorderModal';
import { 
  startRecording,
  stopRecording,
  SAMPLERATE,
  CHANNELS
} from '../audio/audio';

import { 
  cbNewRecording,
  cbListRecordings,
  getRecordingList
} from '../sockets/read';
import { cbUpdateRecording } from '../sockets/update';

class Controls extends React.Component {

  constructor() {
    super();
    this.state = {
      activeIndex: 0,
      recording: false,
      activeRecording: {
        recordingID: -1,
        filepath: '',
        sampleRate: 16000,
        channels: 1,
        recorderID: -1,
        promptID: -1,
        roomID: -1,
        recPrompt: '',
        metrics: {}
      },
      recordings: []
    }

    cbNewRecording(this.onNewRecording);
    cbUpdateRecording(this.onUpdateRecording);
    cbListRecordings(this.onListRecordings);

  }

  componentDidMount() { 
    this._ismounted = true;
  }
  
  componentWillUnmount() {
     this._ismounted = false;
     if(this.state.recording) {
       this.stopRecording();
     }
  }

  onNewRecording = (payload) => {
    let match = this.props.match;
    let roomID = this.props.room.roomID;
    let userID = match.params.userID;
    let promptID = this.props.prompts[this.state.activeIndex].promptID;
    let listPayload = { 
      roomID: roomID,
      recorderID: userID,
      promptID: promptID
    };
    if(this._ismounted)
      this.setState({activeRecording: payload});
    getRecordingList(listPayload);
  }

  onListRecordings = (payload) => {
    if(this._ismounted)
      this.setState({recordings: payload});
  }

  onUpdateRecording = (payload) => {
    let match = this.props.match;
    let roomID = this.props.room.roomID;
    let userID = match.params.userID;
    let promptID = this.props.prompts[this.state.activeIndex].promptID;
    let listPayload = { 
      roomID: roomID,
      recorderID: userID,
      promptID: promptID
    };
    getRecordingList(listPayload);
  }

  next = () => {
    let match = this.props.match;
    let roomID = this.props.room.roomID;
    let userID = match.params.userID;
    let promptID = this.props.prompts[this.state.activeIndex+1].promptID;
    let listPayload = { 
      roomID: roomID,
      recorderID: userID,
      promptID: promptID
    };
    this.setState({activeIndex: this.state.activeIndex+1});
    getRecordingList(listPayload);
  }

  prev = () => {
    let match = this.props.match;
    let roomID = this.props.room.roomID;
    let userID = match.params.userID;
    let promptID = this.props.prompts[this.state.activeIndex-1].promptID;
    let listPayload = { 
      roomID: roomID,
      recorderID: userID,
      promptID: promptID
    };
    this.setState({activeIndex: this.state.activeIndex-1});
    getRecordingList(listPayload);
  }

  startRecording = () => {
    let match = this.props.match;
    let roomID = this.props.room.roomID;
    let userID = match.params.userID;
    let promptID = this.props.prompts[this.state.activeIndex].promptID;
    let payload = { 
      roomID: roomID,
      recorderID: userID,
      promptID: promptID,
      sampleRate: SAMPLERATE,
      channels: CHANNELS
    };
    this.setState({recording: true});
    startRecording(payload);
  }

  stopRecording = () => {
    let match = this.props.match;
    let roomID = this.props.room.roomID;
    let userID = match.params.userID;
    let promptID = this.props.prompts[this.state.activeIndex].promptID;
    let recordingID = this.state.activeRecording.recordingID;
    let payload = { 
      roomID: roomID,
      recorderID: userID,
      promptID: promptID,
      recordingID: recordingID,
      roomKey: this.props.room.roomKey
    };
    this.setState({recording: false});
    stopRecording(payload);
  }

  getNavButtons = () => {
    let i = this.state.activeIndex;
    let l = this.props.prompts.length-1;
    let newRecorder = this.props.newRecorder;
    let updateNewRec = this.props.updateNewRec;
    return (
      <Button.Group widths='3'>
        <Button
          basic
          color='violet'
          content='Back'
          icon='arrow circle left'
          labelPosition='left'
          disabled={i > 0 ? false : true}
          onClick={this.prev}
        />
        <NewRecorderModal newRecorder={newRecorder} updateNewRec={updateNewRec} />
        <Button
          color='violet'
          content='Next'
          icon='arrow circle right'
          labelPosition='right'
          disabled={ i < l ? false: true}
          onClick={this.next}
        />
      </Button.Group>
    );
  }

  getRecordButton = () => {
    let recording = this.state.recording;
    return (
        recording ?
        (<Button
          color='red'
          content='Stop Recording'
          icon='circle'
          labelPosition='right'
          id='rec-button'
          onClick={this.stopRecording}
        />)
        :(<Button
          color='red'
          content='Start Recording'
          icon='circle outline'
          labelPosition='right'
          id='rec-button'
          onClick={this.startRecording}
          disabled={window.hasMicrophone ? false : true}
        />)
    );
  }

  getBars = () => {
    let recording = this.state.recording;
    return (
      <div id='bars' className={recording ? 'active':''}>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
      </div>
    );
  }

  getLatestFile = () => {
    let latest = '';
    for(let i = 0; i < this.state.recordings.length; i++) {
      let current = this.state.recordings[i];
      if(current.filepath && current.filepath !== '') {
        latest = current.filepath;
        break;
      }
    }
    return latest;
  }

  componentWillReceiveProps(nextProps) {
    if(this._ismounted) {
      let i = this.state.activeIndex;
      let max = nextProps.prompts.length-1;
      if(i > max && max !== -1) {
        this.setState({activeIndex: max});
      }
      if(max === -1) {
        this.setState({activeIndex: 0});
      }
      if(nextProps.prompts.length > 0) {
        let match = nextProps.match;
        let roomID = nextProps.room.roomID;
        let userID = match.params.userID;
        let promptID = nextProps.prompts[this.state.activeIndex].promptID;
        let listPayload = { 
          roomID: roomID,
          recorderID: userID,
          promptID: promptID
        };
        getRecordingList(listPayload);
      }
    }
  }

  render(){
    let prompts = this.props.prompts;
    let activeIndex = this.state.activeIndex;
    let navButtons = this.getNavButtons();
    let recButton = this.getRecordButton();
    let bars = this.getBars();
    let latestFile = this.getLatestFile();
    let url = latestFile !== '' ? `/audio/${latestFile}` : '';

    if(prompts.length > 0) {
      return (
        <div className='controller'>
          <Header as='h2' color='violet'>Please Read:</Header>
          <Header id='prompt' as='h1'>{prompts[activeIndex].prompt}</Header>
          {bars}
          {window.hasMicrophone ? recButton : <Header as='h3' color='red'>No microphone is available to record.</Header>}
          {url !== '' ? <Player color='violet' url={url} /> : <Player color='violet' disabled />}
          {navButtons}
        </div>
      )
    } else {
      return (
        <div className='controller'>
          <Header 
            as='h2'
            textAlign='center'
            icon
            disabled
          >
            <Icon name="list alternate" circular />
            <Header.Content>No prompts in session yet, please wait...</Header.Content>
          </Header>
        </div>
      )
    }
  }
}

export default withRouter(Controls);
