import React, { useEffect, useState } from 'react'
import axiosClient from '../axiosClient'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState([])

  useEffect(() => {

  }, [])

  const getExpenses = () => {
    setLoading(true);

    axiosClient.get('/expenses')
    .then(({data}) => {
      setLoading(false);

      console.log(data)

    })
    .catch(() => {
      setLoading(false)
    })
  }

  return (
    <div>Expenses</div>
  )
}

export default Expenses