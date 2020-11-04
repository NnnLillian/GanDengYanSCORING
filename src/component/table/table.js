import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import store from '../../store'
import * as actionTypes from '../../store/constants';
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
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};


class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource,
      count: props.dataSource.length,
    };
  }

  operation = {
    title: 'operation',
    dataIndex: 'operation',
    fixed: 'right',
    width: 100,
    render: (text, record) =>
      this.state.dataSource.length >= 1 ? (
        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
          <a>Delete</a>
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
  };
  handleAdd = () => {
    const action = {
      type: actionTypes.ADD_ROW
    }
    store.dispatch(action)
    this.setState({
      dataSource: this.props.dataSource,
    });
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
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          scroll={{x:600, y:200}}
          columns={[...columns, this.operation]}
          summary={(pageData) => {
            let totalA = 0;
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <span>sss</span>
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