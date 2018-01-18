import React from 'react';
import StompClient from "provotum-stomp-client";
import logger from "react-logger";

class SocketLog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            events: []
        };
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

    successCallback(msg) {
        this.stompClient.subscribe('/contracts/ballot/subscription/deployment', msg => {
            // will cause this component to re-render
            this.setState((previousState, props) => {
                previousState.events.push(msg);

                return {
                    events: previousState.events
                };
            });
        });
    }

    errorCallback(msg) {
        logger.log("error");
    }

    sendBallotDeployment() {
        this.stompClient.send(
            "/websocket/contracts/ballot/deploy",
            {
                "addresses": {
                    "zero-knowledge": "smart contract address"
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

    render() {
        return (
            <div>
                <button onClick={() => this.sendBallotDeployment()}>Click Me</button>
                <ul>
                    {this.state.events.map(event =>
                        <li>{event.address}: {event.error.message}</li>
                    )}
                </ul>
            </div>
        );
    }

}

SocketLog.propTypes = {};

export default SocketLog;
