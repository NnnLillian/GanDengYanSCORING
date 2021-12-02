import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Tooltip } from 'antd';
import { DeleteTwoTone, SettingTwoTone, AlertTwoTone, AlertOutlined } from '@ant-design/icons';
import './style.css'
import store from '../../store'
import * as actionTypes from '../../store/constants';
import * as actionCreators from '../../store/actionCreators';
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};

const renderSummary = (totalValue) => (totalValue.map(i => <Table.Summary.Cell>{i}</Table.Summary.Cell>))

// const checkSum = (totalValueList) => eval(totalValueList.join('+'))

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource,
      count: props.dataSource.length
    };
  }

  handleCheckTable = () => {
    store.dispatch({
      type: actionTypes.CHECK_DATA
    })
  }

  operation = {
    title: <SettingTwoTone twoToneColor="#999" />,
    dataIndex: 'operation',
    fixed: 'right',
    width: 40,
    align: 'center',
    render: (text, record) =>
      this.state.dataSource.length >= 1 ? (
        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
          <DeleteTwoTone />
        </Popconfirm>
      ) : null,
  }

  handleDelete = (key) => {
    const deleteRowAction = {
      rowKey: key,
      type: actionTypes.DELETE_ROW
    }
    store.dispatch(deleteRowAction)
    this.setState({
      dataSource: this.props.dataSource
    });
    this.handleCheckTable()
  };
  handleAdd = () => {
    const action = {
      type: actionTypes.ADD_ROW
    }
    store.dispatch(action)
    this.setState({
      dataSource: this.props.dataSource,
    });
    this.handleCheckTable()
  };
  handleSave = (row) => {
    const newData = [...this.props.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    const action = {
      newData: newData,
      type: actionTypes.EDIT_SCORE
    }
    store.dispatch(action)
    this.setState({
      dataSource: this.props.dataSource,
    });
    this.handleCheckTable()
  };

  render() {
    const dataSource = this.props.dataSource
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.props.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a round
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          scroll={{ x: 600, y: 200 }}
          columns={[...columns, this.operation]}
          summary={() => {
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell className="ant-table-cell-fix-left ant-table-cell-fix-left-last" colSpan={2} index={0}>Total</Table.Summary.Cell>
                {renderSummary(this.props.totalValue)}
                <Table.Summary.Cell fixed="right" className="total-result ant-table-cell-fix-right ant-table-cell-fix-right-first">
                  {/* {checkSum(this.props.totalValue) ? <Tooltip title="something wrong"><AlertTwoTone twoToneColor="#c21f30" /></Tooltip> : <AlertOutlined style={{ color: '#999' }} />} */}
                  {!this.props.result.code ? <Tooltip title={`Round ${this.props.result.game} has ${this.props.result.msg}`}><AlertTwoTone twoToneColor="#c21f30" /></Tooltip> : <AlertOutlined style={{ color: '#999' }} />}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </div>
    );
  }
}




export default EditableTable;