import React, { Component } from 'react';
import { MyCard } from '../../component/card';
import { connect } from 'react-redux';

class Settings extends Component {
  render() {
    return (
      <div style={{ margin: "20px" }}>
        <MyCard
          settingValue={this.props.settings.money}
          allCheck={this.props.settings.all}
          bombCheck={this.props.settings.bomb}
        />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    settings: state.get('settings').toJS()
  }
}
export default connect(mapStateToProps, null)(Settings);