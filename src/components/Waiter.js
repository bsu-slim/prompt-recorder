import React from 'react';
import { Card, Loader } from 'semantic-ui-react';



function Waiter({room}) {

  return (
    <div className="waiter">
      <Card fluid color='violet'>
        <Card.Content>
          <Card.Header>Please Wait for Room '{room}' to be initialized...</Card.Header>
          <Card.Description>
            <Loader active inline='centered' size='massive' />
          </Card.Description>
        </Card.Content>
      </Card>
    </div>
  );

}

export default Waiter;