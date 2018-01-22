import React from 'react';
import {Layout} from 'antd';

const {Header, Content, Footer} = Layout;

class SettingsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <h1>Settings</h1>
    );
  }
}

export default SettingsPage;
