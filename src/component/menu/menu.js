import React from 'react';
import { Menu } from 'antd';
import { ReconciliationOutlined, AppstoreOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom'


class MyMenu extends React.Component {
  state = {
    current: 'home',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    return (
      <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="home" icon={<ReconciliationOutlined />}>
          Home
          <Link to='/' />
        </Menu.Item>
        <Menu.Item key="settings" icon={<AppstoreOutlined />}>
          Settings
          <Link to='/settings' />
        </Menu.Item>
      </Menu>
    );
  }
}

export default MyMenu;