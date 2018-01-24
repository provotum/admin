import React from "react";
import {Badge, Card, Icon, Timeline} from "antd";
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

    logger.log("cleard");
  }

  render() {
    return (
      <div>
        <Card title="Event Log" extra={<ClearBtn actions={{onClickHandler: this.handleClear}}/>}>
          <Timeline>
            {this.state.lastOccurredEvents.map(event =>
              <Timeline.Item key={event.id} dot={<Icon type="check"/>}>
                {event.status}: {event.message} <Badge count={event.message} style={{backgroundColor: '#52c41a'}}/>
                {event.contract.address &&
                <p>{event.contract.type} {'=>'} {event.contract.address}</p>
                }
              </Timeline.Item>
            )}
          </Timeline>
        </Card>
      </div>
    );
  }
}

EventLogCard.propTypes = {
  lastOccurredEvent: PropTypes.object,
  lastOccurredEvents: PropTypes.array
};
