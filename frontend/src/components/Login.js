import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';


import { validate } from './validate';
import { notify } from "./toast"
import styles from "./SignUp.module.css";
import { API } from '../api-service';
import { useCookies } from 'react-cookie';


const Login = () => {

    // Login token
    const [token, setToken] = useCookies(['workout-token']);

    const [data, setData] = useState({
        name: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        setErrors(validate(data, "login"))
    }, [data, touched])

    const changeHandler = event => {
        setData({ ...data, [event.target.name]: event.target.value })
    }

    const focusHanlder = event => {
        setTouched({ ...touched, [event.target.name]: true })
    }

    const submitHandler = event => {
        event.preventDefault();
        if (!Object.keys(errors).length) {

            // Try login
            API.loginUser({ username: data.name, password: data.password })
                .then((resp) => {
                    console.log(resp)
                    setToken('workout-token', resp.token)
                })
                .catch(error => console.log(error)) 
        } else {
            notify("Invalid data!", "error")
            setTouched({
                name: true,
                password: true
            })
        }
    }

    // To check if token exists
    useEffect(() => {
        // Re-direct to dashbaord if it exists
        if (token['workout-token']) {
            window.location.href = '/';
            }
    }, [token]);

    return (
        <div className={styles.container}>
            <form onSubmit={submitHandler} className={styles.formContainer}>
                <h2 className={styles.header}>Login</h2>
                <div className={styles.formField}>
                    <label>Username</label>
                    <input
                        className={(errors.name && touched.name) ? styles.uncompleted : styles.formInput}
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={changeHandler}
                        onFocus={focusHanlder} />
                    {errors.name && touched.name && <span>{errors.name}</span>}
                </div>
                <div className={styles.formField}>
                    <label>Password</label>
                    <input
                        className={(errors.password && touched.password) ? styles.uncompleted : styles.formInput}
                        type="password" name="password"
                        value={data.password}
                        onChange={changeHandler}
                        onFocus={focusHanlder} />
                    {errors.password && touched.password && <span>{errors.password}</span>}
                </div>
                <div className={styles.formButtons}>
                    <Link to="/signup">Sign Up</Link>
                    <button type="submit">Login</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
