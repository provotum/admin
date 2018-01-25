import React from 'react';
import StompClient from "provotum-stomp-client";
import logger from "react-logger";
import EventLogCard from '../components/cards/EventLogCard';
import DeployBtnCard from '../components/cards/DeployBtnCard';
import StatusCard from '../components/cards/StatusCard';
import VoteBtnCard from '../components/cards/VoteBtnCard';
import {reactLocalStorage} from 'reactjs-localstorage';
import {Col, Row} from 'antd';

const zkContractAddressKey = 'zk-contract-address-key';
const ballotContractAddressKey = 'ballot-contract-address-key';
const votingOpenedTrxHashKey = 'voting-opened-trx-key';

class DeploymentContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lastOccurredEvent: null,
      isConnected: false,
      zeroKnowledgeContractAddress: '',
      ballotContractAddress: '',
      deploymentContext: null,
      votingOpenedTrxHash: null,
      votingClosedTrxHash: null,
      supportingVoteCount: null,
      opposingVoteCount: null
    };

    this.deploymentSubscription = null;
    this.votingStatusSubscription = null;

    this.deployBtnClickHandler = this.deployBtnClickHandler.bind(this);
    this.openVoteBtnClickHandler = this.openVoteBtnClickHandler.bind(this);
    this.closeVoteBtnClickHandler = this.closeVoteBtnClickHandler.bind(this);

    this.onReceivedDeployment = this.onReceivedDeployment.bind(this);
    this.onReceiveVotingStatus = this.onReceiveVotingStatus.bind(this);
    this.requestBallotDeployment = this.requestBallotDeployment.bind(this);
    this.requestZeroKnowledgeDeployment = this.requestZeroKnowledgeDeployment.bind(this);
    this.requestOpenVote = this.requestOpenVote.bind(this);
    this.requestCloseVote = this.requestCloseVote.bind(this);

    let intervalId = null;
  }

  componentDidMount() {
    // http://localhost:8080/sockjs-websocket
    this.stompClient = new StompClient(
      "http://localhost:8080",
      "/sockjs-websocket",
      () => logger.log("[stompclient] disconnected")
    );

    // use arrow function so that the "this" keyword within them is actually referring to this class.
    if (!this.state.isConnected) {
      this.stompClient.connect(() => this.successCallback(), () => this.errorCallback());
    }
  }

  componentWillUnmount() {
    if (null !== this.deploymentSubscription) {
      this.deploymentSubscription.unsubscribe();
    }

    if (null !== this.votingStatusSubscription) {
      this.votingStatusSubscription.unsubscribe();
    }

    if (!this.intervalId == null) {
      clearInterval(this.intervalId);
    }
  }

  successCallback(msg) {
    this.deploymentSubscription = this.stompClient.subscribe('/topic/deployments', (msg) => this.onReceivedDeployment(msg));
    this.votingStatusSubscription = this.stompClient.subscribe('/topic/voting-status', (msg) => this.onReceiveVotingStatus(msg));

    this.setState({
      isConnected: true
    });
  }

  errorCallback(msg) {
    logger.log("error: " + msg);
    this.setState({
      isConnected: false
    });
    this.reconnect();
  }

  reconnect() {
    this.stompClient = new StompClient(
      "http://localhost:8080",
      "/sockjs-websocket"
    );
    if (!this.state.isConnected) {
      this.stompClient.connect(() => this.successCallback(), () => this.errorCallback());
      this.intervalId = setInterval(() => {
      }, 1000);
    }
  }


  deployBtnClickHandler(args) {
    // set the question, p and g
    this.setState({
      deploymentContext: args
    });

    // once we got the information about what we want to deploy,
    // actually request a new deployment
    this.requestZeroKnowledgeDeployment(args);
    // The ballot will be deployed automatically once we got the address of the ZK contract.
    // See onReceivedDeployment()
  }

  openVoteBtnClickHandler() {
    this.requestOpenVote();
  }

  requestOpenVote() {
    this.stompClient.send(
      '/websocket/contracts/ballot/open-vote',
      {
        'contract-address': this.state.zeroKnowledgeContractAddress
      }
    );
  }

  closeVoteBtnClickHandler() {
    this.requestCloseVote();
  }

  requestCloseVote() {
    this.stompClient.send(
      '/websocket/contracts/ballot/close-vote',
      {
        'contract-address': this.state.zeroKnowledgeContractAddress
      }
    );
  }

  onReceiveVotingStatus(msg) {
    this.setState((previousState, props) => {

      if (msg.hasOwnProperty('status') && msg.status === 'success') {
        if (msg.hasOwnProperty('transaction')) {
          reactLocalStorage.set(votingOpenedTrxHashKey, msg.transaction);
          previousState.votingOpenedTrxHash = msg.transaction;
        }
      }

      return {
        lastOccurredEvent: msg,
        votingOpenedTrxHash: msg.transaction,
      };
    });
  }

  onReceivedDeployment(msg) {
    // will cause this component to re-render
    this.setState((previousState, props) => {

      if (msg.hasOwnProperty('status') && msg.status === 'success') {
        if (msg.hasOwnProperty('contract') && msg.contract.type === 'zero-knowledge') {
          this.requestBallotDeployment(msg.contract.address);
          // now save that thing also in localStorage
          reactLocalStorage.set(zkContractAddressKey, msg.contract.address);
          // also update the state
          previousState.zeroKnowledgeContractAddress = msg.contract.address;
        } else if (msg.hasOwnProperty('contract') && msg.contract.type === 'ballot') {
          // now save that thing also in localStorage
          reactLocalStorage.set(ballotContractAddressKey, msg.contract.address);
          // also update the state
          previousState.ballotContractAddress = msg.contract.address;
        }
      }

      return {
        lastOccurredEvent: msg,
        zeroKnowledgeContractAddress: previousState.zeroKnowledgeContractAddress,
        ballotContractAddress: previousState.ballotContractAddress
      };
    });
  }

  requestBallotDeployment(zeroKnowledgeContractAddress) {
    this.stompClient.send(
      "/websocket/contracts/ballot/deploy",
      {
        "addresses": {
          "zero-knowledge": zeroKnowledgeContractAddress
        },
        "election": {
          "question": this.state.deploymentContext.question,
          "public-key": {
            "p": this.state.deploymentContext.p,
            "g": this.state.deploymentContext.g
          }
        }
      }
    );
  }

  requestZeroKnowledgeDeployment(args) {
    this.stompClient.send(
      '/websocket/contracts/zero-knowledge/deploy',
      {
        'public-key': {
          'p': args.p,
          'g': args.g
        }
      }
    );
  }

  render() {
    return (
      <div>
        <Row gutter={24}>
          <Col xs={24} style={{marginBottom: 24}}>
            <StatusCard
              isConnected={this.state.isConnected}
              zkContractAddress={this.state.zeroKnowledgeContractAddress}
              ballotContractAddress={this.state.ballotContractAddress}
              votingOpenedTrxHash={this.state.votingOpenedTrxHash}
              votingClosedTrxHash={this.state.votingClosedTrxHash}
              opposingVoteCount={this.state.opposingVoteCount}
              supportingVoteCount={this.state.supportingVoteCount}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col {...smallColResponsiveProps}>
            <DeployBtnCard actions={{onClickHandler: this.deployBtnClickHandler}}/>
          </Col>
          <Col {...smallColResponsiveProps}>
            <VoteBtnCard
              isDeployed={(this.state.isConnected && Boolean(this.state.zeroKnowledgeContractAddress) && Boolean(this.state.ballotContractAddress))}
              actions={{
                onOpenVoteHandler: this.openVoteBtnClickHandler,
                onCloseVoteHandler: this.closeVoteBtnClickHandler
              }}/>
          </Col>
          <Col {...wideColResponsiveProps}>
            <EventLogCard lastOccurredEvent={this.state.lastOccurredEvent}/>
          </Col>
        </Row>
      </div>
    );
  }

}

DeploymentContainer
  .propTypes = {};
export
default
DeploymentContainer;

const
  smallColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: {marginBottom: 24}
  };

const
  wideColResponsiveProps = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 12,
    style: {marginBottom: 24}
  };
