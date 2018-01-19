import React from 'react';
import ContractDeployment from "../deplyoment/ContractDeployment";


class DashboardPage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return (
            <div>
                <ContractDeployment/>
            </div>
        );
    }
}

export default DashboardPage;
