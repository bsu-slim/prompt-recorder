import React from 'react';
import { Button, Progress, Header } from 'semantic-ui-react';

class Player extends React.Component {

  constructor() {
    super();
    this.state = {
      duration: 0,
      location: 0,
      volume: .5,
      playing: false,
      percent: 0,
      ended: false,
      needsReload: false
    }
    this.audio = React.createRef();
  }

  getSec = (ms) => Math.floor(ms/1000);
  getMin = (s) => Math.floor(s/60);
  getExtraSec = (s) => s%60;

  togglePlay = () => {
    this.state.playing ? this.audio.current.pause() : this.audio.current.play();
  };

  handleUpdate = (e) => {
    let audio = e.target;
    if(audio) {
      this.setState({
        location: Math.floor(audio.currentTime*1000),
        percent: Math.floor(audio.currentTime*1000)/this.state.duration*100
      }); 
    }
  }

  handlePause = (e) => {
    this.handleUpdate(e);
    this.setState({playing: false});
  }

  handlePlay = (e) => {
    this.handleUpdate(e);
    this.setState({playing: true});
  }

  handleReplay = (e) => {
    let audio = this.audio.current;
    audio.currentTime = 0;
    this.setState({
      playing: true, 
      ended: false,
      percent: 0
    }, () => (audio.play()));
    
  }

  handleFwd = () => {
    let audio = this.audio.current;
    let current = audio.currentTime*1000;
    let duration = this.state.duration;
    let step = duration/10;
    if(current + step < duration) {
      this.audio.current.currentTime = (current+step)/1000;
    } else {
      this.audio.current.currentTime = duration;
      this.setState({ended: true});
    }

    
  }

  handleBack = () => {
    let audio = this.audio.current;
    let current = audio.currentTime*1000;
    let duration = this.state.duration;
    let step = duration/10;
    if(current - step > 0) {
      this.audio.current.currentTime = (current-step)/1000;
    } else {
      this.audio.current.currentTime = 0;
    }
    this.setState({ended: false});
  }

  handleEnded = (e) => {
    this.setState({playing: false, ended: true});
  }

  handleVolumeChange = (e) => {
    this.setState({volume: e.target.volume});
  }

  handleVolumeUp = () => {
    let audio = this.audio.current;
    let volume = audio.volume;
    if((volume + 0.1) <= 1) {
      this.audio.current.volume = Math.round(10*volume + 1)/10;
    }
  }

  handleVolumeDown = () => {
    let audio = this.audio.current;
    let volume = audio.volume;
    if((volume - 0.1) >= 0) {
      this.audio.current.volume = Math.round(10*volume - 1)/10;
    }
  }

  handleLoad = () => {
    let audio = this.audio.current;
    if(audio) {
      this.setState({
        duration: Math.floor(audio.duration*1000),
        volume: audio.volume
      });
    }
  }

  handleDurationChange = () => {
    let audio = this.audio.current;
    if(audio) {
      this.setState({
        duration: Math.floor(audio.duration*1000),
        volume: audio.volume
      });
    }
  }

  componentDidMount() {
    let audio = this.audio.current;
    audio.addEventListener('loadeddata', this.handleLoad);
    audio.addEventListener('timeupdate', this.handleUpdate);
    audio.addEventListener('play', this.handlePlay);
    audio.addEventListener('pause', this.handlePause);
    audio.addEventListener('ended', this.handleEnded);
    audio.addEventListener('volumechange', this.handleVolumeChange)
    audio.addEventListener('durationchange', this.handleDurationChange);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.url !== this.props.url) {
      this.setState({needsReload: true, ended: false});
    }
    if(nextProps.disabled) {
      this.setState({
        duration: 0,
        location: 0,
        volume: .5,
        playing: false,
        percent: 0,
        ended: false,
        needsReload: false
      })
    }
  }

  componentDidUpdate() {
    if(this.state.needsReload) {
      this.setState({needsReload: false}, this.audio.current.load());
    }
  }

  getAudio = (url) => {
    this.audio = React.createRef();
    return (
      <audio ref={this.audio} id='player-current' src={url} />
    )
  }

  render() {
    let color = this.props.color;
    let url = this.props.url;
    let disabled = this.props.disabled;
    let title = this.props.title;
    let playing = this.state.playing;
    let ended = this.state.ended;
    let volume = this.state.volume;
    //console.log(url);

    let duration = this.state.duration;
    let minutes = this.getMin(this.getSec(duration));
    let seconds = this.getExtraSec(this.getSec(duration));
    
    let location = this.state.location;
    let curMinutes = this.getMin(this.getSec(location));
    let curSeconds = this.getExtraSec(this.getSec(location));

    let percent = this.state.percent;

    let togglePlay = this.togglePlay;
    let handleReplay = this.handleReplay;
    let handleVolumeUp = this.handleVolumeUp;
    let handleVolumeDown = this.handleVolumeDown;
    let handleBack = this.handleBack;
    let handleFwd = this.handleFwd;

    let audio = this.getAudio(url);
    

    if(!disabled) {
      return (
        <div className='player-controls'>
          {audio}
          {title ? <Header as='h5' color='grey' className='player-title'>Recorded By: {title}</Header>:''}
          <Button.Group>
            {!ended ? 
              !playing ? 
                (<Button
                  color={color}
                  icon='play'
                  className='player-play'
                  disabled={duration > 0 ? false : true}
                  onClick={togglePlay}
                />)
                :(<Button
                  color={color}
                  icon='pause'
                  className='player-pause'
                  disabled={duration > 0 ? false : true}
                  onClick={togglePlay}
                />)
              : (<Button
                  color={color}
                  icon='redo'
                  className='player-replay'
                  disabled={duration > 0 ? false : true}
                  onClick={handleReplay}
                />)
            }
            <Button
              color={color}
              icon='backward'
              className='player-backward'
              disabled={duration > 0 ? false : true}
              onClick={handleBack}
            />
            <Button
              color={color}
              icon='forward'
              className='player-forward'
              disabled={duration > 0 ? false : true}
              onClick={handleFwd}
            />
          </Button.Group>
            <Progress 
              color={color}
              className='player-progress'
              percent={percent}
              label={`${curMinutes}:${curSeconds < 10 ? 0:''}${curSeconds} / ${minutes}:${seconds < 10 ? 0:''}${seconds}`} 
            />
          <Button.Group>
            <Button
              color={color}
              as='a'
              href={url}
              icon='download'
              className='player-download'
              disabled={duration > 0 ? false : true}
              download
            />
            <Button
              color={color}
              icon='volume down'
              className='player-down'
              onClick={handleVolumeDown}
            />
            <Button
              color={color}
              icon='volume up'
              className='player-up'
              onClick={handleVolumeUp}
            />
          </Button.Group>
          <div className='volume-indicator'>Volume: {volume*10}/10</div>
        </div>
      )
    } else {
      return (
        <div className='player-controls'>
          {audio}
          <Button.Group>
            <Button
              color={color}
              icon='play'
              className='player-play'
              disabled={true}
            />            
            <Button
              color={color}
              icon='backward'
              className='player-backward'
              disabled={true}
            />
            <Button
              color={color}
              icon='forward'
              className='player-forward'
              disabled={true}
            />
          </Button.Group>
            <Progress 
              color={color}
              className='player-progress'
              percent={percent}
              label={`${curMinutes}:${curSeconds < 10 ? 0:''}${curSeconds} / ${minutes}:${seconds < 10 ? 0:''}${seconds}`} 
            />
          <Button.Group>
            <Button
              color={color}
              as='a'
              href={url}
              icon='download'
              className='player-download'
              disabled={true}
              download
            />
            <Button
              color={color}
              icon='volume down'
              className='player-down'
              onClick={handleVolumeDown}
            />
            <Button
              color={color}
              icon='volume up'
              className='player-up'
              onClick={handleVolumeUp}
            />
          </Button.Group>
          <div className='volume-indicator'>Volume: {volume*10}/10</div>
        </div>
      )
    }
  }
}

export default Player;