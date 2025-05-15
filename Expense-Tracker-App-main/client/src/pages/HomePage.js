import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Table } from 'antd';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Analytics from '../components/Analytics';
import "../styles/HomePage.css"; 


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);
  const [balance, setBalance] = useState(0);
  const [sortBy, setSortBy] = useState('dateDesc'); 
  const [form] = Form.useForm(); 

  const fetchBalance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const response = await axios.post('http://localhost:8000/api/users/getbalance', { userId: user._id });
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const getAllTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      const res = await axios.post("/transactions/get", { userid: user._id, frequency, selectedDate, type, sortBy });
      setLoading(false);
      setAllTransaction(res.data);
    } catch (error) {
      console.log(error);
      message.error('Fetch Issue with Transaction');
    }
  };

  useEffect(() => {
    fetchBalance();
    getAllTransaction();
  }, [frequency, selectedDate, type, sortBy]);

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable && editable._id) {
        await axios.post('/transactions/edit', {
          payload: {
            ...values,
            userid: user._id
          },
          transactionId: editable._id
        });
        message.success('Transaction Updated Successfully');
      } else {
        await axios.post('/transactions/add', { ...values, userid: user._id });
        message.success('Transaction Added Successfully');
      }
      setLoading(false);
      setShowModal(false);
      setEditable(null);
      form.resetFields(); 
      fetchBalance();
      getAllTransaction(); 
    } catch (error) {
      setLoading(false);
      message.error('Failed to add Transaction');
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transactions/delete", { transactionId: record._id });
      setLoading(false);
      message.success("Transaction Deleted");
      fetchBalance();
      getAllTransaction(); 
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error('Unable to Delete');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Category',
      dataIndex: 'category'
    },
    {
      title: 'Reference',
      dataIndex: 'reference'
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => {
            setEditable(record);
            form.setFieldsValue(record); 
            setShowModal(true);
          }} />
          <DeleteOutlined className='mx-2' onClick={() => {
            handleDelete(record);
          }} />
        </div>
      )
    },
  ];

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Range</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
          </Select>
        </div>
        <div>
          <h2>Balance: {balance}</h2>
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>
        <div>
          <h6>Sort By</h6>
          <Select value={sortBy} onChange={(value) => setSortBy(value)}>
            <Select.Option value="amountDesc">Amount (Most to Least)</Select.Option>
            <Select.Option value="amountAsc">Amount (Least to Most)</Select.Option>
            <Select.Option value="dateDesc">Date (Newest to Oldest)</Select.Option>
            <Select.Option value="dateAsc">Date (Oldest to Newest)</Select.Option>
          </Select>
        </div>
        <div className='switch-icons'>
          <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('table')} />
          <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('analytics')} />
        </div>
        <div>
          <button className='btn btn-primary' onClick={() => {
            form.resetFields(); 
            setEditable(null); 
            setShowModal(true);
          }}>Add New</button>
        </div>
      </div>
      <div className="content">
        {viewData === 'table' ? <Table columns={columns} dataSource={allTransaction} />
          : <Analytics allTransaction={allTransaction} />}
      </div>
      <Modal title={editable ? 'Edit Transaction' : 'Add Transaction'} open={showModal} onCancel={() => {
        setShowModal(false);
        setEditable(null); 
        form.resetFields(); 
      }} footer={false}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Income</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bill">Bill</Select.Option>
              <Select.Option value="medical">Health</Select.Option>
              <Select.Option value="fee">Fees</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
              <Select.Option value="other">Others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className='btn btn-primary'>SUBMIT</button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
}

export default HomePage;
