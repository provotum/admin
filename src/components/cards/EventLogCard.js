import React from "react";
import {Badge, List, Card, Icon, Timeline} from "antd";
import PropTypes from "prop-types";
import ClearBtn from "./ClearBtn";
import logger from "react-logger";

export default class EventLogCard extends React.Component {

  constructor(props) {
    super(props);

    let events = [];
    if (null !== props.lastOccurredEvent) {
      events.push(props.lastOccurredEvent);
    }

    this.state = {
      loading: true,
      lastOccurredEvent: props.lastOccurredEvent,
      lastOccurredEvents: events
    };

    this.handleClear = this.handleClear.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let events = this.state.lastOccurredEvents;

    if (null !== nextProps.lastOccurredEvent) {
      events.push(nextProps.lastOccurredEvent);
    }

    this.setState({
      lastOccurredEvent: nextProps.lastOccurredEvent,
      lastOccurredEvents: events
    });
  }

  handleClear() {
    this.setState({
      lastOccurredEvents: []
    });

    logger.log("cleared");
  }

  render() {
    return (
      <Card title="Event Log" extra={<ClearBtn actions={{onClickHandler: this.handleClear}}/>}>
            <List style={divStyle} size="small" renderItem={this.state.lastOccurredEvents}>
              {this.state.lastOccurredEvents.map(event =>
                <List.Item key={event.id}>
                  {event.status}: {event.message} {event.contract.address &&
                event.contract.type} {'=>'} {event.contract.address}
                </List.Item>
              )}
            </List>
      </Card>
    );
  }
}

const divStyle = {
  height: '300px',
  overflow: 'auto'
};

EventLogCard.propTypes = {
  lastOccurredEvent: PropTypes.object,
  lastOccurredEvents: PropTypes.array
};
