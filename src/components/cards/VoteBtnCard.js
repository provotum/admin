import React from "react";
import {Button, Card, Col, Row} from "antd";
import PropTypes from "prop-types";

class VoteBtnCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpenVoteClick = this.handleOpenVoteClick.bind(this);
    this.handleCloseVoteClick = this.handleCloseVoteClick.bind(this);
    this.handleRemoveContractClick = this.handleRemoveContractClick.bind(this);
    this.handleGetResultsClick = this.handleGetResultsClick.bind(this);
  }

  handleOpenVoteClick(e) {
    e.preventDefault();
    this.props.actions.onOpenVoteHandler();
  }

  handleCloseVoteClick(e) {
    e.preventDefault();
    this.props.actions.onCloseVoteHandler();
  }

  handleRemoveContractClick(e) {
    e.preventDefault();
    this.props.actions.onRemoveContractHandler();
  }

  handleGetResultsClick(e) {
    e.preventDefault();
    this.props.actions.onGetResultsHandler();
  }

  render() {
    let disabled = (this.props.isDeployed && this.props.votingClosedTrxHash === null) ? '' : 'disabled';

    let openVotingDisabled = (!this.props.isDeployed | this.props.votingOpenedTrxHash !== null) ? 'disabled' : '';
    let closeVotingDisabled = (!this.props.isDeployed | this.props.votingOpenedTrxHash === null | this.props.votingClosedTrxHash !== null) ? 'disabled' : '';

    return (
      <Card title="Vote Panel">
        <Row>
          <Col span={12} style={{textAlign: 'left'}}>
            <Button type="primary" disabled={openVotingDisabled} onClick={this.handleOpenVoteClick}>Open Voting</Button>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Button type="danger" disabled={closeVotingDisabled} onClick={this.handleCloseVoteClick}>Close Voting</Button>
          </Col>
        </Row>
        <Row>
          <Col span={12} style={{textAlign: 'left'}}>
            <Button type="primary" disabled={(() =>
              ((this.props.votingOpenedTrxHash !== null || this.props.votingClosedTrxHash !== null || !this.props.isDeployed) ? '' : 'disabled'))()}
                    onClick={this.handleGetResultsClick}>Get Results</Button>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Button type="danger" disabled={(() =>
              ((this.props.votingOpenedTrxHash === null && this.props.isDeployed) ? '' : 'disabled'))()}
                    onClick={this.handleRemoveContractClick}>Delete Contracts</Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

VoteBtnCard.propTypes = {
  isDeployed: PropTypes.bool.isRequired,
  votingOpenedTrxHash: PropTypes.string,
  votingClosedTrxHash: PropTypes.string,
  actions: PropTypes.shape({
    onOpenVoteHandler: PropTypes.func.isRequired,
    onCloseVoteHandler: PropTypes.func.isRequired,
    onRemoveContractHandler: PropTypes.func.isRequired,
    onGetResultsHandler: PropTypes.func.isRequired
  })
};

export default VoteBtnCard;
