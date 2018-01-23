import React from 'react';
import ContractDeployment from "../deployment/ContractDeployment";
import StatusCard from "../statuscard/StatusCard";
import ControlPanelCard from "../controlpanelcard/ControlPanelCard";
import {Breadcrumb, Row, Col} from 'antd';
import PropTypes from "prop-types";

class DashboardPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <div>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>{this.props.location.pathname}</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={24}>
          <Col {}>
            <StatusCard/>
          </Col>
          <Col {...topColResponsiveProps}>
            <ControlPanelCard/>
          </Col>
          <Col {...topColResponsiveProps}>
            <ContractDeployment/>
          </Col>
          <Col {...topColResponsiveProps}>
          </Col>
        </Row>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  match: PropTypes.object
};

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {marginBottom: 24},
};

export default DashboardPage;

