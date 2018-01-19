import React from 'react';
import ContractDeployment from "../deplyoment/ContractDeployment";
import {Layout, Menu, Breadcrumb, Card, Row, Col} from 'antd';
const {Header, Content, Footer} = Layout;

class DashboardPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (

      <Layout className="layout">
        <Header>
          <div className="logo"/>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{lineHeight: '64px'}}>
            <Menu.Item key="1">Dashboard</Menu.Item>
            <Menu.Item key="2">Settings</Menu.Item>
          </Menu>
        </Header>
        <Content style={{padding: '0 50px'}}>
          <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{background: '#fff', padding: 24, minHeight: 280}}>
            <Card title="Deployment Updates" extra={<a href="#">Clear</a>} style={{ width: 300 }}>
              <ContractDeployment/>
            </Card>
          </div>
        </Content>
        <Footer style={{textAlign: 'center'}}>
          Provotum | Administration Dashboard | Design ©2018 Created by Provotum
        </Footer>
      </Layout>

    );
  }
}

export default DashboardPage;
