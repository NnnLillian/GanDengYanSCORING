import React, { Component } from 'react';
import { message, Button, Drawer, Form, Input } from 'antd';
import { PlusOutlined, SyncOutlined, ClearOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import store from '../../store'
import * as actionCreators from '../../store/actionCreators';
import { MyTable } from '../../component/table';


class Home extends Component {

  formRef = React.createRef()

  state = {
    visible: false,
    clearVisible: false,
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

  onCloseClearDrawer = () => {
    this.setState({
      clearVisible: false,
    });
  }

  handleInputChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }


  handleAccount = () => {
    store.dispatch(actionCreators.addAccountAction(this.state.inputValue))
    this.onClose()
  }

  refreshTotal = () => {
    store.dispatch(actionCreators.calculateTotalAction())
    message.success("Update TOTAL")
  }

  resetTable = () => {
    this.setState({
      clearVisible: true
    })
  }

  handleTableData = () => {
    store.dispatch(actionCreators.clearDataSource())
    store.dispatch(actionCreators.calculateTotalAction())
    this.setState({
      clearVisible: false
    })
  }

  handleTableAll = () => {
    this.handleTableData()
    store.dispatch(actionCreators.clearColumn())
  }

  render() {
    return (
      <div style={{ margin: "20px" }}>
        <div style={{ float: "right" }}>
          <Button type="primary" shape="circle" icon={<ClearOutlined />} onClick={this.resetTable} style={{ marginRight: '10px' }} />
          <Button type="primary" shape="circle" icon={<SyncOutlined />} onClick={this.refreshTotal} style={{ marginRight: '10px' }} ghost/>
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
        <Drawer
          placement="bottom"
          closable={false}
          onClose={this.onCloseClearDrawer}
          visible={this.state.clearVisible}
          height="140px"
        >
          <Button type="primary" size="large" block style={{ margin: '5px 0' }} onClick={this.handleTableData}>Clean Data</Button>
          <Button size="large" block style={{ margin: '5px 0' }} onClick={this.handleTableAll} danger>Clean All</Button>
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