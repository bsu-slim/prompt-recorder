import React from 'react';
import { Button, List } from 'semantic-ui-react';
import { exportRoomRecordingList } from '../sockets/read';



function Exporter({settings, exported}) {

  function exportData() {
    exportRoomRecordingList(settings);
  }

  function getList() {
    let items = [];
    let dir = exported.dir;
    for(let i = 0; i < exported.list.length; i++) {
      let e = exported.list[i];
      items.push(<List.Item as='a' href={dir+e} download={true} key={e}>{e}</List.Item>)
    }
    return items.reverse();
  }

  let list = getList();

  return (
    <div className="exporter">
      <Button 
        color='green'
        type='button'
        labelPosition='right'
        icon='download'
        content='Export Room Recordings'
        onClick={exportData}
      />
      <List link>
        {list}
      </List>
    </div>
  );

}



export default Exporter;