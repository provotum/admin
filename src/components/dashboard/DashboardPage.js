import React from 'react';
import ContractDeployment from "../deplyoment/ContractDeployment";
import {Breadcrumb} from 'antd';
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
        <ContractDeployment/>
      </div>
    );
  }
}

DashboardPage.propTypes = {
  match: PropTypes.object
};

export default DashboardPage;
