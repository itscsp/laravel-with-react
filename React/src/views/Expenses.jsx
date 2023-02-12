import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axiosClient'
import { useStateContext } from '../context/ContextProvider';

const Expenses = () => {
  const {setNotification} = useStateContext();
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getExpenses();
  }, [])

  const getExpenses = () => {
    setLoading(true);

    axiosClient.get('/expenses')
      .then(({ data }) => {
        setLoading(false);
        setExpenses(data.data)
        // console.log(data)

      })
      .catch(() => {
        setLoading(false)
      })
  }

  const flex = {
    display:'flex', 
    justifyContent: 'space-between',
    alignItems:'center'
  }

  const onDelete = (exp) => {
    if(!window.confirm('Are you sure you want to delete this expense?')){
      return
    }

    axiosClient.delete(`/expenses/${exp.id}`)
      .then(() => {
        //show notification
        setNotification('Expense was successfully deleted')
        // calling get all user funtion
        getExpenses();
      })
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long'};
    return date.toLocaleDateString('en-US', options);
  }
  
  const FormattedDate = ({ dateString }) => <td>{formatDate(dateString)}</td>;

  return (
    <div>
      <div style={flex}>
        <div>Expenses</div>
        <Link className='btn-add' to="/expenses/new">Add New</Link>
      </div>
      <div className="card animated fadInDown">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Added by</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

    {loading &&
          <tbody>
            <tr>
              <td colSpan={4} className="text-center">
                Loading...
              </td>
            </tr>
          </tbody>
    }
    {!loading &&
          
          
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id}>
                {/* <td>{exp.expense_date}</td> */}
                <FormattedDate dateString={exp.expense_date} />
                <td>{exp.user.name}</td>
                <td>{exp.description}</td>
                <td>₹ {exp.amount}</td>
                <td>
                  <Link className='btn-edit' to={'/expenses/' + exp.id}>Edit</Link>
                  &nbsp;
                  <button onClick={ev => onDelete(exp)}  className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody> 
}
        </table>
      </div>
    </div>
  )
}

export default Expenses