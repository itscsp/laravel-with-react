import React, { useRef } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider';


const login = () => {
  
  
  const emailRef = useRef();
  const passwordRef = useRef();
  
  const {setUser, setToken} = useStateContext();

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }

    axiosClient.post('/login', payload)
    .then((data) => {
      debugger;
      console.log(data.data.user)
      setUser(data.data.user);
      setToken(data.data.token);
    })
    .catch(err => {
      const response = err.response;
      if(response && response.status == 422) {
        console.log(response.data.errors)
      }
    })

    console.log(payload)

  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>
          
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef}  type="password" placeholder="Password" />
          <button className="btn btn-block">Login</button>
          <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
        </form>
      </div>
    </div>
  )
}

export default login