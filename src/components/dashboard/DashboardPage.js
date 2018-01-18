import React from 'react';
import SocketLog from "../socket-log/SocketLog";


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
            </div>
        );
    }
}

export default DashboardPage;
