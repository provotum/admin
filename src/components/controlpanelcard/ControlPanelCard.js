import React from 'react';
import { Card, Button} from 'antd';

export default class StatusCard extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <Card title="Control Panel">
        <p>
          <Button type="dashed" icon="download">Deploy</Button></p>
      </Card>
    )
  }
}

