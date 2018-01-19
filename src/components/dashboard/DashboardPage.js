import React from 'react';
import ContractDeployment from "../deplyoment/ContractDeployment";
import {Col, Row} from 'antd';

class DashboardPage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return (
            <Row>
                <Col span={20}/>
                <Col span={4}>
                    <ContractDeployment/>
                </Col>
            </Row>
        );
    }
}

export default DashboardPage;
