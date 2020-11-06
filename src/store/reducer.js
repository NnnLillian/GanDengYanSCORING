import { fromJS, List, Map } from 'immutable';
import * as actionTypes from './constants';
import * as tool from '../tools/tools';

const defaultState = fromJS({
  columns: [
    {
      title: 'Round',
      dataIndex: 'game',
      width: 80,
      fixed: true
    },
    {
      title: 'Booms',
      dataIndex: 'boom',
      width: 80,
      editable: true,
      fixed: true
    },
    {
      title: 'John',
      dataIndex: 'John',
      editable: true,
      width: 100
    }
  ],
  data: [{
    key: 1,
    game: '1',
    boom: 0,
    John: "2",
  }, {
    key: 1322,
    game: '2',
    boom: 0,
    John: "4",
  }],
  total: {
    John: 6
  }
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.ADD_ACCOUNT:
      let newColumn = {
        title: action.value,
        editable: true,
        dataIndex: action.value,
        width: 100
      }
      let newData = tool.updateTableData(state.get('data').toJS(), action.value, 0)
      return state.merge({
        columns: List(state.get('columns')).push(newColumn),
        data: List(newData),
        total: state.get('total').set(action.value, 0)
      });
    case actionTypes.EDIT_SCORE:
      let newTotal = tool.calcTotal(action.newData, state.get('total').toJS())
      return state.merge({
        data: List(action.newData),
        total: Map(newTotal)
      })
    case actionTypes.ADD_ROW:
      let newRow = tool.insertTableData(state.get('columns').toJS(), state.get('data').toJS().length)
      return state.set('data', List(state.get('data').push(newRow)))
    case actionTypes.DELETE_ROW:
      let afterDeleteRow = tool.deleteTableData(state.get('data').toJS(), action.rowKey)
      let newTotals = tool.calcTotal(afterDeleteRow, state.get('total').toJS())
      return state.merge({
        data: List(afterDeleteRow),
        total: Map(newTotals)
      })
    default:
      return state;
  }
}