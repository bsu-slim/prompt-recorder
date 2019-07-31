import React from 'react';
import { Form, Checkbox, Header } from 'semantic-ui-react';
import { updateRoomActive, updateRoomShuffle } from '../sockets/update';


class Settings extends React.Component {

  handleRoomActive = (e, val) => {
    let payload = this.props.settings;
    payload.active = val.checked === true ? 1 : 0;
    updateRoomActive(payload);
  }
  
  handleRoomShuffle = (e, val) => {
    let payload = this.props.settings;
    payload.shuffle = val.checked === true ? 1 : 0;
    updateRoomShuffle(payload);
  }

  render() {
    let settings = this.props.settings;
    return (
      <div id='prompts'>
        <Header color='violet' as='h4'>Settings Manager:</Header>
        <Form>
          <Form.Group>
            <Form.Field>
              <Checkbox
                color='violet'
                name='active'
                label={<label>Allow Users To Record? (Activate Session)</label>}
                checked={settings.active === 0 ? false : true}
                onChange={this.handleRoomActive}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              <Checkbox
                color='violet'
                name='shuffle'
                label={<label>Randomize Prompt Order? (Knuth Shuffle)</label>}
                checked={settings.shuffle === 0 ? false : true}
                onChange={this.handleRoomShuffle}
                disabled={settings.active ? true:false}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </div>
    );
  }
}



export default Settings;
