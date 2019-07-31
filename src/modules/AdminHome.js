import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Log from '../components/Log';
import Joiner from '../components/Joiner';
import './Modules.css';

function AdminHome() {
  return (
    <div className="App">
      <Header as='h1' color='violet'>Prompt Recorder V2.0 Admin Panel</Header>
      <Grid columns='equal' padded>
        <Grid.Column>
          <Joiner admin='admin' />
        </Grid.Column>
        <Grid.Column>
          <Log />
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default AdminHome;
