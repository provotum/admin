import React from 'react';
import StompClient from "provotum-stomp-client";
import logger from "react-logger";
import EventLogCard from '../components/cards/EventLogCard';
import DeployBtnCard from '../components/cards/DeployBtnCard';
import StatusCard from '../components/cards/StatusCard';
import VoteBtnCard from '../components/cards/VoteBtnCard';
import {reactLocalStorage} from 'reactjs-localstorage';
import {Col, Row} from 'antd';
import axios from 'axios';


const zkContractAddressKey = 'zk-contract-address-key';
const ballotContractAddressKey = 'ballot-contract-address-key';
const votingOpenedTrxHashKey = 'voting-opened-trx-key';
const votingClosedTrxHashKey = 'voting-closed-trx-key';

class DeploymentContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lastOccurredEvent: null,
      isConnected: false,
      isDeploying: false,
      zeroKnowledgeContractAddress: '',
      ballotContractAddress: '',
      deploymentContext: null,
      votingOpenedTrxHash: null,
      votingClosedTrxHash: null,
      supportingVoteCount: null,
      opposingVoteCount: null
    };

    this.deploymentSubscription = null; // /topic/deployments -- "responseType": "<ballot-deployed|zero-knowledge-deployed>"
    this.votingStatusSubscription = null; // /topic/state -- "responseType": "<open-vote|close-vote>"
    this.contractRemovalSubscription = null; // /topic/removals -- "responseType": "<ballot-removed|zero-knowledge-removed>"
    this.metaSubscription = null; // /topic/meta" -- "responseType": "get-question-event", "responseType": "get-results-event",
    this.voteSubscription = null; // /topic/votes --   "responseType": "<vote|vote-event>",
    this.blockchainEventSubscription = null; // /topic/events -- "responseType": "<vote-event|change-event|proof-event>",

    this.deployBtnClickHandler = this.deployBtnClickHandler.bind(this);
    this.openVoteBtnClickHandler = this.openVoteBtnClickHandler.bind(this);
    this.closeVoteBtnClickHandler = this.closeVoteBtnClickHandler.bind(this);
    this.removeContractBtnClickHandler = this.removeContractBtnClickHandler.bind(this);
    this.retrieveResultsClickHandler = this.retrieveResultsClickHandler.bind(this);

    this.onReceivedDeployment = this.onReceivedDeployment.bind(this);
    this.onReceiveVotingStatus = this.onReceiveVotingStatus.bind(this);
    this.requestBallotDeployment = this.requestBallotDeployment.bind(this);
    this.requestZeroKnowledgeDeployment = this.requestZeroKnowledgeDeployment.bind(this);
    this.requestOpenVote = this.requestOpenVote.bind(this);
    this.requestCloseVote = this.requestCloseVote.bind(this);
    this.retrieveResults = this.retrieveResults.bind(this);

    this.onReceiveBlockchainEvent = this.onReceiveBlockchainEvent.bind(this);

    axios.defaults.baseURL = 'http://localhost:8080';
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

    if (null !== this.contractRemovalSubscription) {
      this.contractRemovalSubscription.unsubscribe();
    }

    if (null !== this.metaSubscription) {
      this.metaSubscription.unsubscribe();
    }

    if (null !== this.blockchainEventSubscription) {
      this.blockchainEventSubscription.unsubscribe();
    }

    if (null !== this.voteSubscription) {
      this.voteSubscription.unsubscribe();
    }
  }

  successCallback(msg) {

    this.deploymentSubscription = this.stompClient.subscribe('/topic/deployments', (msg) => this.onReceivedDeployment(msg));
    this.votingStatusSubscription = this.stompClient.subscribe('/topic/state', (msg) => this.onReceiveVotingStatus(msg));
    this.contractRemovalSubscription = this.stompClient.subscribe('/topic/removals', (msg) => this.onReceiveRemoveContract(msg));
    this.metaSubscription = this.stompClient.subscribe('/topic/meta', (msg) => this.onReceiveMeta(msg));
    this.voteSubscription = this.stompClient.subscribe('/topic/votes', (msg) => this.onReceiveVotes(msg));
    this.blockchainEventSubscription = this.stompClient.subscribe('/topic/events', (msg) => this.onReceiveBlockchainEvent(msg));

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
      setTimeout(() => {
        this.stompClient.connect(() => this.successCallback(), () => this.errorCallback());
      }, 3000);
    }
  }


  deployBtnClickHandler(args) {
    // set the question, p and g
    this.setState({
      isDeploying: true,
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
    let query = "ballot/" + this.state.ballotContractAddress + "/open-vote";
    axios.post(query)
      .then(function (response) {
        logger.log(response);
      })
      .catch(function (error) {
        logger.log(error);
      });
  }

  closeVoteBtnClickHandler() {
    this.requestCloseVote();
  }

  requestCloseVote() {
    let closeQuery = "ballot/" + this.state.ballotContractAddress + "/close-vote";
    axios.post(closeQuery)
      .then(function (response) {
        logger.log(response);
      })
      .catch(function (error) {
        logger.log(error);
      });
  }

  onReceiveMeta(msg) {
    this.setState((previousState, props) => {
      if (msg.hasOwnProperty('responseType') && msg.responseType === 'get-results-event'
        && msg.hasOwnProperty('success') && msg.status === 'success') {

        if ('success' === msg.status) {
          previousState.supportingVoteCount = msg.votes.yes;
          previousState.opposingVoteCount = msg.votes.no;
        } else {
          logger.error(msg);
        }
      }

      return {
        lastOccurredEvent: msg,
        supportingVoteCount: previousState.supportingVoteCount,
        opposingVoteCount: previousState.opposingVoteCount
      };
    });
  }

  retrieveResultsClickHandler() {
    this.retrieveResults();
  }

  retrieveResults() {
    let query = "/ballot/" + this.state.ballotContractAddress + "/results";

    axios.post(query)
      .then((response) => logger.log(response))
      .catch((error) => logger.log(error));
  }


  removeContractBtnClickHandler() {
    this.removeContracts();
  }

  removeContracts() {
    // zero-knowledge/{contractAddress}/remove
    let zkQuery = "/zero-knowledge/" + this.state.zeroKnowledgeContractAddress + "/remove";
    let ballotQuery = "/ballot/" + this.state.ballotContractAddress + "/remove";

    axios.delete(zkQuery)
      .then(function (response) {
        logger.log(response);
      })
      .catch(function (error) {
        logger.log(error);
      });

    axios.delete(ballotQuery)
      .then(function (response) {
        logger.log(response);
      })
      .catch(function (error) {
        logger.log(error);
      });
  }

  onReceiveVotingStatus(msg) {
    this.setState((previousState, props) => {
      if (msg.hasOwnProperty('responseType') && msg.status === 'success') {
        if (msg.responseType === 'open-vote') {
          reactLocalStorage.set(votingOpenedTrxHashKey, msg.transaction);
          previousState.votingOpenedTrxHash = msg.transaction;
        } else if (msg.responseType === 'close-vote') {
          reactLocalStorage.set(votingClosedTrxHashKey, msg.transaction);
          previousState.votingClosedTrxHash = msg.transaction;
        }
      } else if (msg.hasOwnProperty('responseType') && msg.status === 'error') {
        if (msg.responseType === 'open-vote') {
          logger.log("Error on open-vote" + msg);
        } else if (msg.responseType === 'close-vote') {
          logger.log("Error on close-vote" + msg);
        }
      }

      return {
        lastOccurredEvent: msg,
        votingOpenedTrxHash: previousState.votingOpenedTrxHash,
        votingClosedTrxHash: previousState.votingClosedTrxHash

      };
    });
  }

  onReceiveBlockchainEvent(msg) {
    this.setState({
      lastOccurredEvent: msg
    });
  }


  onReceiveVotes(msg) {
    this.setState({
      lastOccurredEvent: msg
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
          previousState.isDeploying = false;
        }
      }

      return {
        lastOccurredEvent: msg,
        zeroKnowledgeContractAddress: previousState.zeroKnowledgeContractAddress,
        ballotContractAddress: previousState.ballotContractAddress
      };
    });
  }


  //   this.contractRemovalSubscription = this.stompClient.subscribe('/topic/removals',(msg) => this.onReceiveRemoveContract(msg));
  onReceiveRemoveContract(msg) {
    this.setState((previousState, props) => {
      if (msg.hasOwnProperty('status') && msg.status === 'success') {
        if (msg.responseType === 'zero-knowledge-removed') {
          // now set zkContract to null in local storage
          reactLocalStorage.set(zkContractAddressKey, null);
          // also update the state
          previousState.zeroKnowledgeContractAddress = null;

        } else if (msg.responseType === 'ballot-removed') {
          // now save that thing also in localStorage
          reactLocalStorage.set(ballotContractAddressKey, null);
          // also update the state
          previousState.ballotContractAddress = null;
          previousState.votingOpenedTrxHash = null;
        }
      }

      if (msg.hasOwnProperty('status') && msg.status === 'error') {
        if (msg.responseType === 'zero-knowledge-removed') {
          logger.log("zero-knowledge-removed failed");
        } else if (msg.responseType === 'ballot-removed') {
          logger.log("ballot-removed failed");
        }
      }

      return {
        lastOccurredEvent: msg,
        zeroKnowledgeContractAddress: previousState.zeroKnowledgeContractAddress,
        ballotContractAddress: previousState.ballotContractAddress,
        votingOpenedTrxHashKey: previousState.votingOpenedTrxHash
      };
    });
  }


  requestBallotDeployment(zeroKnowledgeContractAddress) {
    axios.post('/ballot/deploy', {
      "election": {
        "question": this.state.deploymentContext.question
      }, "addresses": {"zero-knowledge": zeroKnowledgeContractAddress}
    })
      .then(function (response) {
        logger.log(response);
      })
      .catch(function (error) {
        logger.log(error);
      });
  }

  requestZeroKnowledgeDeployment(args) {
    axios.post('/zero-knowledge/deploy')
      .then(function (response) {
        logger.log(response);
      })
      .catch(function (error) {
        logger.log(error);
      });
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
            <DeployBtnCard
              isConnected={this.state.isConnected}
              isDeploying={this.state.isDeploying}
              isDeployed={(this.state.isConnected && Boolean(this.state.zeroKnowledgeContractAddress) && Boolean(this.state.ballotContractAddress))}
              actions={{onClickHandler: this.deployBtnClickHandler}}/>
          </Col>
          <Col {...smallColResponsiveProps}>
            <VoteBtnCard
              isDeployed={(this.state.isConnected && Boolean(this.state.zeroKnowledgeContractAddress) && Boolean(this.state.ballotContractAddress))}
              votingOpenedTrxHash={this.state.votingOpenedTrxHash}
              votingClosedTrxHash={this.state.votingClosedTrxHash}
              actions={{
                onOpenVoteHandler: this.openVoteBtnClickHandler,
                onCloseVoteHandler: this.closeVoteBtnClickHandler,
                onRemoveContractHandler: this.removeContractBtnClickHandler,
                onGetResultsHandler: this.retrieveResultsClickHandler
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

DeploymentContainer.propTypes = {};
export default DeploymentContainer;

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
