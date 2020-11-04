import { fromJS, List, Map } from 'immutable';
import * as actionTypes from './constants';
import * as tool from '../tools/tools';

const defaultState = fromJS({
  columns: [
    {
      title: 'Game',
      dataIndex: 'game',
      width: 80,
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
    John: "2",
  }, {
    key: 1322,
    game: '2',
    John: "4",
  }]
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
        data: List(newData)
      });
    case actionTypes.EDIT_SCORE:
      return state.set('data', List(action.newData));
    case actionTypes.ADD_ROW:
      let newRow = tool.insertTableData(state.get('columns').toJS(), state.get('data').toJS().length)
      return state.set('data', List(state.get('data').push(newRow)))
    case actionTypes.DELETE_ROW:
      let afterDeleteRow = tool.deleteTableData(state.get('data').toJS(), action.rowKey)
      return state.set('data', List(afterDeleteRow))
    default:
      return state;
  }
}