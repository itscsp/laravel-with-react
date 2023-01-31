import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../axiosClient'
import { useStateContext } from '../context/ContextProvider'


const ExpenseForm = () => {
    // debugger
    const navigate = useNavigate();
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    let CURRENT_USER_ID = localStorage.getItem('CURRENT_USER_ID')
    const {setNotification} = useStateContext()
debugger
    const [expense, setExpense] = useState({
        user_id: CURRENT_USER_ID,
        expense_date: '',
        description: '',
        amount: null,
    })
    
  
    
    if (id) {
        useEffect(() => {
            setLoading(true);

            axiosClient.get(`/expenses/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setExpense(data);
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (expense.id) {
            axiosClient.put(`/expenses/${expense.id}`, expense)
                .then(() => {
                    //Todo show notification
                    setNotification('Expense was successfully updated')
                    navigate('/expenses')
                })
                .catch(err => {
                    const response = err.response;

                    // if (response && response.status == 422) {
                        setError(response.data.errors)
                    // }
                })
        } else {
            axiosClient.post(`/add-expense`, expense)
            .then(() => {
                //Todo show notification
                setNotification('Expense was successfully created')

                navigate('/expenses')
            })
            .catch(err => {
                const response = err.response;

                // if (response && response.status == 422) {
                    setError(response.data.errors)
                // }
            })
        }
    }


    return (
        <>
            {expense.id && <h1>Update Expense</h1>}
            {!expense.id && <h1>New Expenses</h1>}

            <div className="card animated fadeInDown">
                {loading &&
                    <div className="text-center">
                        Loading..
                    </div>
                }

                {error &&
                    <div className='alert'>
                        {Object.keys(error).map(key => (
                            <p key={key}>{error[key][0]}</p>
                        ))}
                    </div>

                }
                {!loading &&
                    <form onSubmit={onSubmit}>

                        <input type='date' value={expense.expense_date}

                            onChange={ev => setExpense(
                                {
                                    ...expense, expense_date: ev.target.value, 
                                }
                            )
                            } placeholder='Expense date'
                        />

                        <input type="text" value={expense.description}

                            onChange={ev => setExpense(
                                {
                                    ...expense, description: ev.target.value
                                }
                            )
                            } placeholder='Expense Description'
                        />

                        <input type='number' value={expense.amount}

                            onChange={ev => setExpense(
                                {
                                    ...expense, amount: ev.target.value
                                }
                            )
                            } placeholder='Expense amount'
                        />

                        <button className='btn'>Save</button>

                    </form>

                }
            </div>

        </>
    )
}

export default ExpenseForm