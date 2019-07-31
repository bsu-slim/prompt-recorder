import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Log from '../components/Log';
import Recorder from '../components/Recorder';
import './Modules.css';


function UserHome() {
  return (
    <div className="App">
      <Header as='h1' color='violet'>Prompt Recorder V2.0</Header>
      <Grid columns='equal' padded>
        <Grid.Column>
          <Recorder />
        </Grid.Column>
        <Grid.Column>
          <Log />
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default UserHome;
