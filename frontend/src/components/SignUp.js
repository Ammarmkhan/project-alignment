import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import styles from "./SignUp.module.css";

import { validate } from "./validate";
import { notify } from './toast';
import { API } from '../api-service';


const SignUp = () => {
    // To hold name and password
    const [data, setData] = useState({
        name: "",  
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        setErrors(validate(data));
    }, [data, touched]);

    const changeHandler = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const focusHandler = (event) => {
        setTouched({ ...touched, [event.target.name]: true });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (Object.keys(errors).length === 0) {

            // Try to register
            API.registerUser({ username: data.name, password: data.password })
            .then((response) => {
                if (response.username === data.name) {
                    notify("Registration successful", "success");
                } else {
                    notify(response.username[0], "error");
                } 
            })
            .catch(error => console.log(error))
        } else {
            notify("Registration failed", "error");
            setTouched({ name: true, password: true });
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={submitHandler} className={styles.formContainer}>
                <h2 className={styles.header}>SignUp</h2>
                <div className={styles.formField}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        className={
                            errors.name && touched.name
                                ? styles.uncompleted
                                : styles.formInput
                        }
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={changeHandler}
                        onFocus={focusHandler}
                    />
                    {errors.name && touched.name && <span>{errors.name}</span>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        className={
                            errors.password && touched.password
                                ? styles.uncompleted
                                : styles.formInput
                        }
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={changeHandler}
                        onFocus={focusHandler}
                    />
                    {errors.password && touched.password && (
                        <span>{errors.password}</span>
                    )}
                </div>
                <div className={styles.formButtons}>
                <Link to="/login" style={{ color: '#4BCEAC' }}>Login</Link>
                    <button type="submit">Sign Up</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default SignUp;
