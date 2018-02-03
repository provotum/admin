import React from "react";
import {Alert, Badge, Card, Steps, Icon} from "antd";
import PropTypes from "prop-types";

const Step = Steps.Step;

export default class StatusCard extends React.Component {

  constructor(props) {
    super(props);

    this.getCurrentStep = this.getCurrentStep.bind(this);
  }

  getCurrentStep() {
    let index = (this.props.isConnected ? 1 : 0)
      | ((this.props.zkContractAddress && this.props.ballotContractAddress) ? 2 : 0)
      | ((this.props.votingOpenedTrxHash) ? 4 : 0)
      | ((this.props.votingClosedTrxHash) ? 8 : 0)
      | ((this.props.supportingVoteCount !== null && this.props.opposingVoteCount !== null) ? 16 : 0);


    switch (index) {
      case 31:
        return 4;
      case 15:
        return 3;
      case 7:
        return 2;
      case 3:
        return 1;
      case 1:
        return 0;
      default:
        return 0;
    }
  }

  render() {
    let backgroundColor = (this.props.isConnected) ? '#52c41a' : '#f5222d';
    let connectionStatus = (this.props.isConnected) ? 'connected' : 'disconnected';

    let stepConfiguration = {
      current: 0,
      steps: [
        {
          title: "Ready",
          content: "Backend Application is ready to deploy a new vote."
        },
        {
          title: "Contracts Deployed",
          content: "Zero-Knowledge Contract is deployed at " + this.props.zkContractAddress + ", the ballot is available at " + this.props.ballotContractAddress
        },
        {
          title: "Voting is ongoing",
          content: "The corresponding opening transaction is at " + this.props.votingOpenedTrxHash
        },
        {
          title: "Voting closed",
          content: "The corresponding close transaction is at " + this.props.votingClosedTrxHash
        },
        {
          title: "Results counted",
          content: "The voting result is " + this.props.supportingVoteCount + ' of a total of ' + (this.props.supportingVoteCount + this.props.opposingVoteCount) + ' votes'
        }
      ]
    };

    const currentStep = this.getCurrentStep();

    return (
      <Card title="Current Status" extra={<Badge style={{backgroundColor: backgroundColor}} count={connectionStatus}/>}>
        <Steps current={currentStep} size="small">
          {stepConfiguration.steps.map((item, idx) => <Step key={item.title} title={item.title}
                                                            icon={(() => ((idx === currentStep && currentStep === 2 || idx === currentStep && currentStep === 0 && !this.props.isConnected)) ?
                                                              <Icon type="loading"/> : '')()}/>)}
        </Steps>
        <div className="steps-content" style={{background: "#fafafa", marginTop: "16px", padding: '10px'}}>
          <Alert
            message={(() =>
              ((this.props.isConnected === true) ? stepConfiguration.steps[this.getCurrentStep()].content : "Lost Websocket connection, trying to reconnect."))()}
            type={(() =>
              ((this.props.isConnected === true) ? "info" : "error"))()}
          />
        </div>
      </Card>
    );
  }
}

//{stepConfiguration.steps[this.getCurrentStep()].content}

StatusCard.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  zkContractAddress: PropTypes.string,
  ballotContractAddress: PropTypes.string,
  votingOpenedTrxHash: PropTypes.string,
  votingClosedTrxHash: PropTypes.string,
  supportingVoteCount: PropTypes.number,
  opposingVoteCount: PropTypes.number
};
