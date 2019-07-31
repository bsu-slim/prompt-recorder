import React from 'react';
import { 
  Form,
  Button,
  Header,
  Message,
  List,
  Icon,
  Dropdown,
  Popup,
  Checkbox
} from 'semantic-ui-react';

import { createPrompt } from '../sockets/create';


class Importer extends React.Component {

  constructor() {
    super()
    this.state = {
      prompts: [],
      language: 1,
      add: false,
      file: ''
    }
  }

  onLanguageChange = (e, { value }) => this.setState({language: value});

  onFileSelect = (e) => {
    let text = '';
    if (e.target.files && e.target.files[0]) {
      var myFile = e.target.files[0];
      this.setState({file: myFile});
      var reader = new FileReader();
      
      reader.addEventListener('load', (e) => {
        text = e.target.result;
        let prompts = text.split('\n');
        for(let i = 0; i < prompts.length; i++) {
          prompts[i] = {prompt: prompts[i]};
        }
        this.setState({prompts: prompts});
      });
      
      reader.readAsBinaryString(myFile);
    }   
  }

  onCreate = (e) => {
    let prompts = this.state.prompts;
    prompts.forEach((item) => {
      let payload = {
        prompt: item.prompt,
        add: this.state.add,
        roomID: this.props.room.roomID,
        roomKey: this.props.room.roomKey,
        languageID: 1
      };
      createPrompt(payload);
    });
    this.setState({prompts: []})
    document.getElementById('prompt-file').value = '';
  }

  handleAddToggle = () => {
    this.setState({add: !this.state.add});
  }

  render() {
    let languages = this.props.languages;
    let language = this.state.language;
    let add = this.state.add;
    let options = [];
    languages.forEach((item) => {
      options.push({
        key: item.languageID+'-lang',
        text: `${item.languageName} (${item.languageTag})`,
        value: item.languageID
      });
    });
    return (
      <div id='prompts'>
        <Header color='violet' as='h4'>Import Prompts From File:</Header>
        <Form id="prompt-file-create" className="prompt-file-form">
          <Form.Field>
            <Checkbox
              color='violet'
              name='add'
              label={<label>Auto Add To Current Room? </label>}
              checked={add}
              onChange={this.handleAddToggle}
            />
          </Form.Field>
          <Form.Field>
          <label>Prompt File&nbsp;
            <Popup trigger={<Icon name="help circle" />} flowing hoverable>
              <div className='file-format'>
                <h4>Prompt File Format:</h4>
                <p>A list of prompts in a text file, new-line ('\n') delimited like the following:</p>
                <Message>
                    <p>
                        This is prompt 1. <br />
                        This is prompt 2. <br />
                        This is prompt 3. <br />
                    </p>
                </Message>
              </div>
            </Popup>:
          </label>
          <input type="file" id="prompt-file" onChange={this.onFileSelect} />
          </Form.Field>
          <Form.Field>
            <label>Prompt Language:</label>
            <Dropdown
              fluid
              selection
              onChange={this.onLanguageChange}
              options={options}
              value={language}
            />
          </Form.Field>
          <Form.Field id='prompts-in-file'>
            <label>Prompts Recognized In Selected File:</label>
            <List className='prompt-list' divided verticalAlign='middle'>
              { this.state.prompts.length > 0 ?
                this.state.prompts.map( (item, index) => {
                  return (
                    <List.Item key={index}>
                      <List.Content>
                        {item.prompt}
                      </List.Content>
                    </List.Item>
                  )
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
            <Button.Group floated='right'>
              <Button 
                  type='button'
                  color="green"
                  onClick={this.onCreate}
                  icon='plus circle'
                  content='Create Prompt(s)'
                  labelPosition='right'
              />
            </Button.Group>
          </Form.Field>
          
        </Form>
      </div>
    );
  }
}

export default Importer;
