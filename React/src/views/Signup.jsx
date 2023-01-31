import React, { useRef } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axiosClient from '../axiosClient'


const signup = () => {
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const roleref = useRef();
  const statusref = useRef();
  const senderEmailRef = useRef();
  const senderPasswordRef = useRef();

  const [error, setError] = useState(null)


  const onSubmit = (ev) => {
    ev.preventDefault()


    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
      role: roleref.current.value,
      status: statusref.current.value,
      senderEmail: senderEmailRef.current.value,
      senderPassword: senderPasswordRef.current.value
    }

    axiosClient.post('/signup', payload)
      .then(({data}) => {
  
        console.log(data.user)
        navigate('/dashboard')

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

          <input ref={nameRef} type="text" placeholder="User Full Name" />
          <input ref={emailRef} type="email" placeholder="User Email" />
          <input ref={passwordRef} type="password" placeholder="User Password" />
          <input ref={passwordConfirmationRef} type="password" placeholder="User Password Confirmation" />
        
         
          <select ref={roleref}>
            <option selected> Select User Role</option>
          
            <option value="0">Member</option>
          </select>
      
         
        
          <select ref={statusref}>
            <option  selected> Select User Status</option>
            <option value="1">active</option>
            <option value="0">inactive</option>
          </select>
         
          <input ref={senderEmailRef} type="email" placeholder="Enter Your Email" />
          <input ref={senderPasswordRef}  type="password" placeholder="Enter Your Password" />


          <button className="btn btn-block">Signup</button>
          <p className="message">Already registered? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  )
}

export default signup