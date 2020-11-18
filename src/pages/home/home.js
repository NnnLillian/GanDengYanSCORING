import React, { Component } from 'react';
import { Button, Drawer, Form, Input } from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import store from '../../store'
import * as actionTypes from '../../store/constants';
import { MyTable } from '../../component/table';

class Home extends Component {

  formRef = React.createRef()

  state = {
    visible: false,
    inputValue: ''
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.formRef.current.resetFields()
    this.setState({
      visible: false,
    });
  };


  handleInputChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }


  handleAccount = () => {
    const action = {
      value: this.state.inputValue,
      type: actionTypes.ADD_ACCOUNT
    }
    store.dispatch(action)
    this.onClose()
  }

  render() {
    return (
      <div style={{ margin: "20px" }}>
        <div style={{ float: "right" }}>
            <Button shape="circle" icon={<SyncOutlined />} style={{marginRight:'10px'}}/>
          <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={this.showDrawer}>Add player</Button>
        </div>
        <Drawer
          title="Create a new player"
          width={300}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.handleAccount} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark ref={this.formRef}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter user name' }]}
            >
              <Input
                placeholder="Please enter user name"
                onChange={this.handleInputChange}
              />
            </Form.Item>
          </Form>
        </Drawer>
        <MyTable
          dataSource={this.props.data}
          columns={this.props.columns}
          total={this.props.total}
          totalValue={Object.values(this.props.total)}
          pagination={false}
          scroll={{ y: 600 }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.get('columns').toJS(),
    data: state.get('data').toJS(),
    total: state.get('total').toJS()
  }
}



export default connect(mapStateToProps, null)(Home);