import { Card, Input, Switch, Divider } from 'antd';
import React, { Component } from 'react';
import { HighlightOutlined, PayCircleOutlined, AuditOutlined } from '@ant-design/icons';

import * as actionCreators from '../../store/actionCreators';
import store from '../../store'

const { Grid } = Card

const girdStyle = {
  width: '100%',
}

class BasicCard extends Component {

  state = {
    moneyInputEdit: true
  }

  handleEditMoneyInput = () => {
    this.setState({
      moneyInputEdit: false
    });
  }

  disableEdit = () => {
    this.setState({
      moneyInputEdit: true
    });
  }

  handleMoney = value => {
    if (value.length === 0) value = 1
    store.dispatch(actionCreators.editMoneyAction(value))
    this.disableEdit()
    store.dispatch(actionCreators.calculateTotalAction())
  }

  onDoubleForAll = (checked) => {
    store.dispatch(actionCreators.switchAllAction(checked))
    store.dispatch(actionCreators.calculateTotalAction())
  }

  onDoubleForBomb = (checked) => {
    store.dispatch(actionCreators.switchBombAction(checked))
    store.dispatch(actionCreators.calculateTotalAction())
  }

  render() {
    return (
      <Card title="Rules">
        <Grid style={girdStyle} hoverable={false}>
          <Card type="inner" title="Base Value"  extra={<HighlightOutlined onClick={this.handleEditMoneyInput}/>}>
            <div style={{ margin: "20px" }}>
              {
                !this.state.moneyInputEdit ?
                  <Input.Search
                    prefix={<PayCircleOutlined />}
                    enterButton={<AuditOutlined />}
                    onSearch={this.handleMoney}
                  /> :
                  <Input
                    prefix={<PayCircleOutlined />}
                    bordered={false}
                    value={this.props.settingValue}
                    disabled={true}
                  />
              }
            </div>
          </Card>
        </Grid>
        <Grid style={girdStyle} hoverable={false}>
          <Card type="inner" title="Double">
            <div style={{ margin: "20px" }}>
              Not Takeout Cards <Switch style={{ float: 'right' }} onChange={this.onDoubleForAll} checked={this.props.allCheck} />
              <Divider />
              Bomb <Switch style={{ float: 'right' }} onChange={this.onDoubleForBomb} checked={this.props.bombCheck} />
            </div>
          </Card>
        </Grid>
      </Card>
    );
  }
}

export default BasicCard

