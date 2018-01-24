import React from "react";
import {Button, Card, Col, Row} from "antd";
import PropTypes from "prop-types";

class VoteBtnCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpenVoteClick = this.handleOpenVoteClick.bind(this);
    this.handleCloseVoteClick = this.handleCloseVoteClick.bind(this);
  }

  handleOpenVoteClick(e) {
    e.preventDefault();

    this.props.actions.onOpenVoteHandler();
  }

  handleCloseVoteClick(e) {
    e.preventDefault();

    this.props.actions.onCloseVoteHandler();
  }

  render() {
    let disabled = (this.props.isDeployed) ? '' : 'disabled';

    return (
      <Card title="Vote Panel">
        <Row>
          <Col span={12} style={{textAlign: 'left'}}>
            <Button type="primary" disabled={disabled} onClick={this.handleOpenVoteClick}>Open Voting</Button>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Button type="danger" disabled={disabled} onClick={this.handleCloseVoteClick}>Close Voting</Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

VoteBtnCard.propTypes = {
  isDeployed: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    onOpenVoteHandler: PropTypes.func.isRequired,
    onCloseVoteHandler: PropTypes.func.isRequired
  })
};

export default VoteBtnCard;
