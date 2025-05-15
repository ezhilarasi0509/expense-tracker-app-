import React, { useState, useEffect } from 'react';
import { Form, Input, message} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons'; 
import axios from 'axios';
import Spinner from '../components/Spinner';
import "../styles/Loginpage.css";
import loginImg from './download.jpg';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (values) => {
        try {
            setLoading(true);
            const { data } = await axios.post('/users/login', values);
            setLoading(false);
            message.success('Login Success');
            localStorage.setItem('user', JSON.stringify({ ...data, password: '' }));
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.log(error);
            if(error.message === 'Request failed with status code 404')
                message.error('User Not Registered');
            else if(error.message === 'Request failed with status code 401')
                message.error('Invalid Credentials');
            else
                message.error("Server Error");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="login-page">
            {loading && <Spinner />}
            <div className="login-container">
                <div className="login-img">
                    <img src={loginImg} alt="login-img" />
                </div>
                <div className="login-form-container">
                    <h1 className="login-title">&emsp;&emsp;&emsp;&emsp;Expense Tracker</h1>
                    <p className="login-subtitle">Login</p>
                    <Form layout="vertical" onFinish={submitHandler} className="login-form">
                        <Form.Item label="Email Address" name="email">
                            <Input prefix={<UserOutlined />} type='email' size="large" />
                        </Form.Item>
                        <Form.Item label="Password" name="password">
                            <Input prefix={<LockOutlined />} type='password' size="large" />
                        </Form.Item>
                        <button className='login-button'>Login</button>
                        <p className="signup-text">Don't have an account? <Link to="/register">Sign Up</Link></p>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
