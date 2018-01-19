import React from 'react';
import SocketLog from "../socket-log/SocketLog";
import { Timeline } from 'antd';


class DashboardPage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return (
            <div>
                <SocketLog/>
              <Timeline>
                <Timeline.Item>step1 2015-09-01</Timeline.Item>
                <Timeline.Item>step2 2015-09-01</Timeline.Item>
                <Timeline.Item>step3 2015-09-01</Timeline.Item>
                <Timeline.Item>step4 2015-09-01</Timeline.Item>
              </Timeline>
            </div>
        );
    }
}

export default DashboardPage;
