import React, { useRef } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import axiosClient from '../axiosClient'
import { useStateContext } from '../context/ContextProvider';

const signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [error, setError] = useState(null)

  const { setUser, setToken } = useStateContext();

  const onSubmit = (ev) => {
    ev.preventDefault()


    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,

    }

    axiosClient.post('/signup', payload)
      .then(({data}) => {
  
        console.log(data.user)
        setUser(data.user);
        setToken(data.token);
      })
      .catch(err => {
        const response = err.response;

        if (response && response.status == 422) {
          setError(response.data.errors)
        }
      })

    console.log(payload)
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Signup for free</h1>

          {error &&
            <div className='alert'>
              {Object.keys(error).map(key => (
                <p key={key}>{error[key][0]}</p>
              ))}
            </div>

          }

          <input ref={nameRef} type="text" placeholder="Full Name" />
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
          <button className="btn btn-block">Signup</button>
          <p className="message">Already registered? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  )
}

export default signup