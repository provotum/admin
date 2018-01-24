import React from "react";
import {Card, Avatar, Badge} from "antd";
import PropTypes from "prop-types";

export default class StatusCard extends React.Component {



  render () {
    return (
      <Card title="Status">
        <Card.Meta />
        <p>
          <Avatar style={{ backgroundColor: "green", verticalAlign: 'middle' }} size="large">
            OK
          </Avatar></p>
        <p>
          <Badge status="success" />
          <Badge status="error" />
          <Badge status="default" />
          <Badge status="processing" />
          <Badge status="warning" />
          <br />
          <Badge status="success" text="Success" />
          <br />
          <Badge status="error" text="Error" />
          <br />
          <Badge status="default" text="Default" />
          <br />
          <Badge status="processing" text="Processing" />
          <br />
          <Badge status="warning" text="Warning" />
        </p>
        <p>Connected: {JSON.stringify(this.props.isConnected)}</p>
        <p>zkContractAddress: {this.props.zkContractAddress}</p>
        <p>ballotContractAddress: {this.props.ballotContractAddress}</p>
      </Card>
    )
  }
}

StatusCard.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  zkContractAddress: PropTypes.string.isRequired,
  ballotContractAddress: PropTypes.string.isRequired
};