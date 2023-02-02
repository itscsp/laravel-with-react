import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider';

const UserForm = () => {
  const navigate = useNavigate();
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  let CURRENT_USER_ID = localStorage('CURRENT_USER_ID')
  const {setNotification} = useStateContext()

  const [user, setUser] = useState({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: null,
      status: null,
      senderEmail: '',
      senderPassword: ''
  })

  if(id) {
    useEffect(() => {
      setLoading(true);

      axiosClient.get('')
    })
  }


  return (
    <div>UserForm</div>
  )
}

export default UserForm