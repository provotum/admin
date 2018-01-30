import React from 'react';
import { Card, Button} from 'antd';
import PropTypes from 'prop-types';

export default class RemovalBtnCard extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Card title="Removal Panel">
        <p>
          <Button type="dashed" icon="download" onClick={this.props.actions.onClickHandler()}>Deploy</Button></p>
      </Card>
    );
  }
}

RemovalBtnCard.propTypes = {
  actions: PropTypes.shape({
    onClickHandler: PropTypes.func.isRequired
  })
};
