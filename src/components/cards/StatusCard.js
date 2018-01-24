import React from "react";
import {Badge, Card, Steps} from "antd";
import PropTypes from "prop-types";

const Step = Steps.Step;

export default class StatusCard extends React.Component {

  constructor(props) {
    super(props);

    this.getCurrentStep = this.getCurrentStep.bind(this);
  }

  getCurrentStep() {
    let index = (this.props.isConnected ? 1 : 0)
      ^ ((this.props.zkContractAddress && this.props.ballotContractAddress) ? 3 : 0)
      ^ ((this.props.votingOpenedTrxHash) ? 1 : 0)
      ^ ((this.props.votingOpenedTrxHash && this.props.votingClosedTrxHash) ? 6 : 0)
      ^ ((this.props.votingClosedTrxHash) ? 3 : 0)
      ^ ((this.props.supportingVoteCount && this.props.opposingVoteCount) ? 1 : 0);

    // index may be zero if not yet connected
    return Math.max(0, (index - 1));
  }


  render() {
    let backgroundColor = (this.props.isConnected) ? '#52c41a' : '#f5222d';
    let connectionStatus = (this.props.isConnected) ? 'connected' : 'disconnected';

    let stepConfiguration = {
      current: 0,
      steps: [
        {
          title: "Ready",
          content: "Backend Application is ready to deploy a new vote"
        },
        {
          title: "Contracts Deployed",
          content: "Zero-Knowledge Contract is deployed at " + this.props.zkContractAddress + ", the ballot is available at " + this.props.ballotContractAddress
        },
        {
          title: "Voting is opened",
          content: "The corresponding transaction is at " + this.props.votingOpenedTrxHash
        },
        {
          title: "Voting ongoing",
          content: "See the event log for information about the current vote status."
        },
        {
          title: "Voting closed",
          content: "The corresponding transaction is at " + this.props.votingClosedTrxHash
        },
        {
          title: "Results counted",
          content: "The voting result is " + this.props.supportingVoteCount + ' of a total of ' + (this.props.supportingVoteCount + this.props.opposingVoteCount) + ' votes'
        }
      ]
    };

    return (
      <Card title="Current Status" extra={<Badge style={{backgroundColor: backgroundColor}} count={connectionStatus}/>}>
        <Steps current={this.getCurrentStep()} size="small">
          {stepConfiguration.steps.map(item => <Step key={item.title} title={item.title}/>)}
        </Steps>
        <div className="steps-content" style={{background: "#fafafa", marginTop: "16px", padding: '10px'}}>
          {stepConfiguration.steps[this.getCurrentStep()].content}
        </div>
      </Card>
    );
  }
}

StatusCard.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  zkContractAddress: PropTypes.string,
  ballotContractAddress: PropTypes.string,
  votingOpenedTrxHash: PropTypes.string,
  votingClosedTrxHash: PropTypes.string,
  supportingVoteCount: PropTypes.number,
  opposingVoteCount: PropTypes.number
};
