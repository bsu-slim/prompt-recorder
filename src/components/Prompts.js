import React from 'react';
import { 
  Form,
  Input,
  Button,
  Header,
  List,
  Icon
} from 'semantic-ui-react';
import { createPromptList } from '../sockets/create';
import { deletePromptList } from '../sockets/delete';

class Prompts extends React.Component {
  
  constructor() {
    super();
    this.state = {
      search: ''
    }
  }

  onPromptAdd = (pid, e) => {
    createPromptList({promptID: pid, roomID: this.props.settings.roomID, roomKey: this.props.settings.roomKey});
    this.props.sendSearch();
  }

  onPromptRemove = (pid, e) => {
    deletePromptList({promptID: pid, roomID: this.props.settings.roomID, roomKey: this.props.settings.roomKey});
    this.props.sendSearch();
  }

  render() {
    let prompts = this.props.prompts;
    let search = this.props.search;
    
    return (
      <div id='prompts'>
        <Header color='violet' as='h4'>Prompt Manager:</Header>
        
        <Form>
          <Form.Group widths={16}>
            <Form.Field width={16}>
              <label>Search Prompts:</label>
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
          Prompts Available:
        </Header>
        <List className='prompt-list-manager' divided verticalAlign='middle'>
          { prompts.length > 0 ?
            prompts.map( (item, index) => {
              return !item.promptlistExistsForRoom ?
              (
                <List.Item key={index}>
                  <List.Content floated='right'>
                    <Button 
                      color='green'
                      content='Add'
                      icon='plus circle'
                      size='mini'
                      labelPosition='right'
                      onClick={this.onPromptAdd.bind(null, item.promptID)}
                    />
                  </List.Content>
                  <Icon name='chat' />
                  <List.Content>
                    {item.prompt}
                  </List.Content>
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
              <Header.Content>No existing prompts...</Header.Content>
            </Header>
          }
        </List>
        <Header as='h5'>
          Prompts In Session:
        </Header>
        <List className='prompt-list-manager' divided verticalAlign='middle'>
          { prompts.length > 0 ?
            prompts.map( (item, index) => {
              return item.promptlistExistsForRoom ?
              (
                <List.Item key={index}>
                  <List.Content floated='right'>
                    <Button
                      color='red'
                      content='Remove'
                      icon='times circle'
                      size='mini'
                      labelPosition='right'
                      onClick={this.onPromptRemove.bind(null, item.promptID)}
                    />
                  </List.Content>
                  <Icon name='chat' />
                  <List.Content>
                    {item.prompt} 
                  </List.Content>
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
              <Header.Content>No existing prompts...</Header.Content>
            </Header>
          }
        </List>
      </div>
    );
  }
}



export default Prompts;
