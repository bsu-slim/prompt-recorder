import React from 'react';
import Player from './Player';
import { 
  Form,
  Input,
  Header,
  List,
  Icon
} from 'semantic-ui-react';

class Recordings extends React.Component {
  
  constructor() {
    super();
    this.state = {
      search: ''
    }
  }

  render() {
    let prompts = this.props.prompts;
    let recordings = this.props.recordings;
    let search = this.props.search;
    
    return (
      <div id='recordings'>
        <Header color='violet' as='h4'>Recording Manager:</Header>
        
        <Form>
          <Form.Group widths={16}>
            <Form.Field width={16}>
              <label>Search Recordings:</label>
              <Input
                fluid
                placeholder='Search...'
                name='search'
                action={{ color: 'violet', labelPosition: 'right', icon: 'search', content: 'Search', onClick: this.props.sendSearch }}
                onChange={this.props.onUpdateSearch}
                value={search}
              />
            </Form.Field>
          </Form.Group>
        </Form>

        <Header as='h5'>
          Recordings In Session:
        </Header>
        <List className='recording-list-manager' divided verticalAlign='middle'>
          { prompts.length > 0 ?
            prompts.map( (item, index) => {
              let promptID = item.promptID;
              let recs = recordings.filter(function(rec) {
                return rec.promptID === promptID;
              });
              return item.promptlistExistsForRoom ?
              (
                <List.Item key={index}>
                  <Icon name='chat' />
                  <List.Content>
                    {item.prompt} 
                  </List.Content>
                  {recs.length > 0 ? 
                    recs.map((r, index) => {
                      return (<Player color='violet' key={r.recordingID} url={`/audio/${r.filepath}`} title={r.recorderID} />)
                    })
                    : <Player color='violet' disabled />
                  }
                  
                </List.Item>
              ) : ''
            })
            :
            <Header 
              as='h2'
              textAlign='center'
              icon
              disabled
            >
              <Icon name="list alternate" circular />
              <Header.Content>No prompts in room yet...</Header.Content>
            </Header>
          }
        </List>
      </div>
    );
  }
}



export default Recordings;
