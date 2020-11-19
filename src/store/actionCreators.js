import * as actionTypes from './constants'

export const calculateTotalAction = () => ({
  type: actionTypes.UPDATE_TOTAL
})

export const editMoneyAction = (value) => ({
  value: value,
  type: actionTypes.EDIT_MONEY
})

export const switchAllAction = (checked) => ({
  checked,
  type: actionTypes.SWITCH_ALL
})

export const switchBombAction = (checked) => ({
  checked,
  type: actionTypes.SWITCH_BOMB
})

export const addAccountAction = (inputValue) => ({
  value: inputValue,
  type: actionTypes.ADD_ACCOUNT
})

export const clearDataSource = () => ({
  type: actionTypes.CLEAR_DATA
})

export const clearColumn = () => ({
  type: actionTypes.CLEAR_COLUMN
})