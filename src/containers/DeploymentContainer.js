import React from 'react';
import StompClient from "provotum-stomp-client";
import logger from "react-logger";
import EventLogCard from '../components/cards/EventLogCard';
import DeployBtnCard from '../components/cards/DeployBtnCard';
import StatusCard from '../components/cards/StatusCard';
import {reactLocalStorage} from 'reactjs-localstorage';
import {Row, Col} from 'antd';

const zkContractAddressKey = 'zk-contract-address-key';
const ballotContractAddressKey = 'ballot-contract-address-key';

class DeploymentContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lastOccurredEvent: null,
      isConnected: false,
      zeroKnowledgeContractAddress: '',
      ballotContractAddress: '',
      deploymentContext: null
    };

    this.deploymentSubscription = null;

    this.deployBtnClickHandler = this.deployBtnClickHandler.bind(this);
    this.onReceivedDeployment = this.onReceivedDeployment.bind(this);
    this.requestBallotDeployment = this.requestBallotDeployment.bind(this);
    this.requestZeroKnowledgeDeployment = this.requestZeroKnowledgeDeployment.bind(this);
  }

  componentDidMount() {
    // http://localhost:8080/sockjs-websocket
    this.stompClient = new StompClient(
      "http://localhost:8080",
      "/sockjs-websocket"
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
  }

  successCallback(msg) {
    this.deploymentSubscription = this.stompClient.subscribe('/topic/deployments', (msg) => this.onReceivedDeployment(msg));
    this.setState({
      isConnected: true
    });
  }

  errorCallback(msg) {
    logger.log("error: " + msg);
    this.setState({
      isConnected: false
    });
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
      <Row gutter={24}>
        <Col {...topColResponsiveProps}>
          <StatusCard isConnected={this.state.isConnected} zkContractAddress={this.state.zeroKnowledgeContractAddress}
                      ballotContractAddress={this.state.ballotContractAddress}/>
        </Col>
        <Col {...topColResponsiveProps}>
          <DeployBtnCard actions={{onClickHandler: this.deployBtnClickHandler}}/>
        </Col>
        <Col {...topColResponsiveProps}>
          <EventLogCard lastOccurredEvent={this.state.lastOccurredEvent}/>
        </Col>
      </Row>
    );
  }

}

DeploymentContainer.propTypes = {};
export default DeploymentContainer;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {marginBottom: 24},
};
