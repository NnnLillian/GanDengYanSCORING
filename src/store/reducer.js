import { fromJS, List, Map } from 'immutable';
import * as actionTypes from './constants';
import * as tool from '../tools/tools';
import { FireTwoTone, TrophyTwoTone } from '@ant-design/icons';

const defaultState = fromJS({
  columns: [
    {
      title: <TrophyTwoTone twoToneColor="#fed71a" />,
      dataIndex: 'game',
      width: 30,
      align: 'center',
      fixed: true
    },
    {
      title: <FireTwoTone twoToneColor="#de1c31" />,
      dataIndex: 'boom',
      width: 30,
      align: 'center',
      editable: true,
      fixed: true
    },
    {
      title: 'John',
      dataIndex: 'John',
      editable: true,
      width: 80
    },
    {
      title: 'lillian',
      dataIndex: 'lillian',
      editable: true,
      width: 80
    },
    {
      title: 'Sam',
      editable: true,
      dataIndex: 'Sam',
      width: 80
    }
  ],
  data: [
    {
      key: 1,
      game: '1',
      boom: 0,
      John: '2',
      lillian: '3',
      Sam: '0'
    },
    {
      key: 1322,
      game: '2',
      boom: 0,
      John: '4',
      lillian: '5',
      Sam: '0'
    },
    {
      key: 1604725800822,
      game: 3,
      boom: '1',
      John: '1',
      lillian: '5',
      Sam: '0'
    }],
  total: {
    John: -7,
    lillian: -13,
    Sam: 0
  },
  settings: {
    money: 0.5, // 一张牌代表多少钱
    all: true, // 全关是否翻倍
    bomb: true, // 炸弹是否翻倍
  }
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.ADD_ACCOUNT:
      let newColumn = {
        title: action.value,
        editable: true,
        dataIndex: action.value,
        width: 80
      }
      let newData = tool.updateTableData(state.get('data').toJS(), action.value, '0')
      return state.merge({
        columns: List(state.get('columns')).push(newColumn),
        data: List(newData),
        total: state.get('total').set(action.value, 0)
      });
    case actionTypes.EDIT_SCORE:
      let newTotal = tool.calcTotal(action.newData, state.get('total').toJS(), state.get('settings').toJS())
      return state.merge({
        data: List(action.newData),
        total: Map(newTotal)
      })
    case actionTypes.ADD_ROW:
      let newRow = tool.insertTableData(state.get('columns').toJS(), state.get('data').toJS().length)
      return state.set('data', List(state.get('data').push(newRow)))
    case actionTypes.DELETE_ROW:
      let afterDeleteRow = tool.deleteTableData(state.get('data').toJS(), action.rowKey)
      let newTotals = tool.calcTotal(afterDeleteRow, state.get('total').toJS(), state.get('settings').toJS())
      return state.merge({
        data: List(afterDeleteRow),
        total: Map(newTotals)
      })
    case actionTypes.EDIT_MONEY:
      return state.setIn(['settings', 'money'], action.value)
    case actionTypes.UPDATE_TOTAL:
      return state.set('total', Map(tool.calcTotal(state.get('data').toJS(), state.get('total').toJS(), state.get('settings').toJS())))
    case actionTypes.SWITCH_ALL:
      return state.setIn(['settings', 'all'], action.checked)
    case actionTypes.SWITCH_BOMB:
      return state.setIn(['settings', 'bomb'], action.checked)
    case actionTypes.CLEAR_DATA:
      return state.set('data', List([]))
    case actionTypes.CLEAR_COLUMN:
      return state.merge({
        columns: defaultState.get('columns'),
        total: Map({})
      })
    default:
      return state;
  }
}