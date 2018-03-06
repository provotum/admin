import React from "react";
import {Button, Card, Col, Row, Switch} from "antd";
import PropTypes from "prop-types";


class VoteBtnCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpenVoteClick = this.handleOpenVoteClick.bind(this);
    this.handleRemoveContractClick = this.handleRemoveContractClick.bind(this);
    this.handleGetResultsClick = this.handleGetResultsClick.bind(this);
  }

  handleOpenVoteClick(isChecked) {
    console.log(isChecked);
    if (true === isChecked) {
      this.props.actions.onOpenVoteHandler();
    } else {
      this.props.actions.onCloseVoteHandler();
    }
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
    let openVotingDisabled = (!this.props.isDeployed || null !== this.props.votingOpenedTrxHash);
    let closeVotingDisabled = (!this.props.isDeployed || null === this.props.votingOpenedTrxHash || null !== this.props.votingClosedTrxHash);
    let getResultsDisabled = (!this.props.isDeployed || null === this.props.votingOpenedTrxHash || null === this.props.votingClosedTrxHash);

    return (
      <Card title="Vote Panel">
        <Row>
          <Col span={12} style={{textAlign: 'left', marginBottom: 24}}>
            Open vote
          </Col>
          <Col span={12} style={{textAlign: 'right', marginBottom: 24}}>
            <Button.Group size={"large"}>
              <Switch disabled={openVotingDisabled || closeVotingDisabled} checkedChildren="Voting opened"
                      unCheckedChildren="Voting closed" onChange={this.handleOpenVoteClick}/>
            </Button.Group>
            <br/>
          </Col>
        </Row>
        <Row>
          <Col span={12} style={{textAlign: 'left', marginBottom: 24}}>
            Get Election Results
          </Col>
          <Col span={12} style={{textAlign: 'right', marginBottom: 24}}>
            <Button.Group size={"small"}>
              <Button type="primary" disabled={getResultsDisabled}
                      onClick={this.handleGetResultsClick}>Get Results
              </Button>
            </Button.Group>
            <br/>
          </Col>
        </Row>
        <Row>
          <Col span={12} style={{textAlign: 'left', marginBottom: 24}}>
            Delete Contracts
          </Col>
          <Col span={12} style={{textAlign: 'right', marginBottom: 24}}>
            <Button.Group size={"small"}>
              <Button type="danger" disabled={(() =>
                ((this.props.votingOpenedTrxHash === null && this.props.isDeployed) ? '' : 'disabled'))()}
                      onClick={this.handleRemoveContractClick}>Delete Contracts
              </Button>
            </Button.Group>
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
