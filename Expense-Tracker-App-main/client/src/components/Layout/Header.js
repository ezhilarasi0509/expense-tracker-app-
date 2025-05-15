import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/HeaderStyles.css";
import { UserOutlined } from '@ant-design/icons'; 

const Header = () => {
    const [loginUser, setLoginUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setLoginUser(user);
        }
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem("user");
        message.success("Logout Successful");
        navigate("/login");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link className="navbar-brand" to="/">Expense Tracker</Link>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item d-flex align-items-center">
                                {loginUser &&
                                    <>
                                        <UserOutlined className="user-icon" />
                                        <p className="nav-link">{loginUser.name}</p>
                                    </>
                                }
                            </li>
                            <li className="nav-item">
                                <Button className="btn-secondary" onClick={logoutHandler}>Logout</Button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
