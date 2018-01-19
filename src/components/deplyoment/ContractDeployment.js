import React from 'react';
import StompClient from "provotum-stomp-client";
import logger from "react-logger";
import {Button, Timeline} from 'antd';
import {Col, Row} from 'antd';

class ContractDeployment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            deploymentEvents: []
        };

        this.deploymentSubscription = null;
    }

    componentDidMount() {
        // http://localhost:8080/sockjs-websocket
        this.stompClient = new StompClient(
            "http://localhost:8080",
            "/sockjs-websocket"
        );

        // use arrow function so that the "this" keyword within them is actually referring to this class.
        this.stompClient.connect(() => this.successCallback(), () => this.errorCallback());
    }

    componentWillUnmount() {
        if (null !== this.deploymentSubscription) {
            this.deploymentSubscription.unsubscribe();
        }
    }

    successCallback(msg) {
        this.deploymentSubscription = this.stompClient.subscribe('/topic/deployments', (msg) => this.onReceivedDeployment(msg));
    }

    errorCallback(msg) {
        logger.log("error: " + msg);
    }

    onReceivedDeployment(msg) {
        // will cause this component to re-render
        this.setState((previousState, props) => {
            previousState.deploymentEvents.unshift(msg);

            if (msg.hasOwnProperty('status') && msg.status === 'success' &&
                msg.hasOwnProperty('contract') && msg.contract.type === 'zero-knowledge') {
                this.requestBallotDeployment(msg.contract.address);
            }

            return {
                deploymentEvents: previousState.deploymentEvents
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
                    "question": "a question the participants want to vote on",
                    "public-key": {
                        "p": 0,
                        "g": 0
                    }
                }
            }
        );
    }

    requestZeroKnowledgeDeployment() {
        this.stompClient.send(
            '/websocket/contracts/zero-knowledge/deploy',
            {
                'public-key': {
                    'p': 0,
                    'g': 0
                }
            }
        );
    }

    render() {
        return (
            <div>
                <Row>
                    <h1>Deployment</h1>
                </Row>
                <Row>
                    <Button onClick={() => this.requestZeroKnowledgeDeployment()}>Deploy</Button>
                </Row>
                <Row>
                    <Timeline pending="Listening for events...">
                        {this.state.deploymentEvents.map(event =>
                            <Timeline.Item key={event.id}>
                                {event.status}: {event.message}
                                {event.contract.address &&
                                <p>{event.contract.type} {'=>'} {event.contract.address}</p>
                                }
                            </Timeline.Item>
                        )}
                    </Timeline>
                </Row>
            </div>
        );
    }

}

ContractDeployment.propTypes = {};

export default ContractDeployment;
