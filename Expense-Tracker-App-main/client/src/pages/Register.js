import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { FaRupeeSign } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import axios from 'axios';
import '../styles/RegisterPage.css';
import registerImg from './register.jpg';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form Submit
  const submitHandler = async (values) => {
    let emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
    if (!(values.name)) {
      message.error('Name can\'t be empty');
      return;
    }
    else if (!(values.email)) {
      message.error('Email can\'t be empty');
      return;
    }
    else if (!(emailRegex.test(values.email))) {
      message.error('Enter valid email');
      return;
    }
    else if (!(values.password)) {
      message.error('Password can\'t be empty');
      return;
    }
    else if (values.password.length < 6 || values.password.length > 20) {
      message.error('Password length should be 6 - 20');
      return;
    }
    else if (!(passwordRegex.test(values.password))) {
      message.error('Password should be alphanumeric only');
      return;
    }
    else if (!(values.initialBalance)) {
      message.error('Initial Balance can\'t be empty');
      return;
    }
    try {
      setLoading(true);
      await axios.post('/users/register', values);
      setLoading(false);
      message.success('Registration Successful');
      navigate('/login');
    } catch (error) {
      setLoading(false);
      message.error('Server Error');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <div className="register-page">
        {loading && <Spinner />}
        <div className="register-container">
          <div className="form-container">
            <h1>&emsp;&emsp;&emsp;&emsp;&ensp;Expense Tracker</h1>
            <p className='register-subtitle'>Register</p>
            <Form layout="vertical" onFinish={submitHandler}>
              <Form.Item label="Name" name="name" className="form-item">
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item label="Email" name="email" className="form-item">
                <Input type="email" prefix={<MailOutlined />} />
              </Form.Item>
              <Form.Item label="Password" name="password" className="form-item">
                <Input type="password" prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item label="Initial Balance" name="initialBalance" className="form-item">
                <Input type="number" prefix={<FaRupeeSign />} />
              </Form.Item>
              <div className="d-flex">
                <button type="submit" className="btn">Register</button>
              </div>
              <div className='d-flex'>
                <Link to="/login" className="link">Registered User?</Link>
              </div>
            </Form>
          </div>
          <div className="image-container">
            <img src={registerImg} alt="Welcome" className="register-image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
