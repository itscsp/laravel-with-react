import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider';

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [total_expense, setTotal_expense] = useState()
  const [total_investment, setTotal_invesment] = useState()
  const { user } = useStateContext();

  const Logeduser = user

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);

    axiosClient.get('/monthly-totals/2/2023')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.result);
        setTotal_expense(data.Total_expense_of_month);
        setTotal_invesment(data.Total_investment_of_month);
        console.log(data.result[0])
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])


  const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  return (
    <div>
      <div style={flex}>
        <div>
          <p>Total Monthly Expenses : {total_expense}</p>
          <p>Total Monthly Direct Investment: {total_investment ? total_investment : 'No direct investment'}</p>
        </div>
        {Logeduser.role == 1 &&
          <Link className='btn-add' to="/user/new">Add New</Link>
        }

      </div>
      <div className="card animated fadInDown">
        <table>
          <thead>
            <tr>

              <th>Name</th>
              <th>Total Expense</th>
              <th>Total Investment</th>
              <th>Balance to pay</th>
              <th>Balance to receive</th>
              {Logeduser.role == 1 &&
                <th>Action</th>
              }
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
              {users.map(user => (
                <tr key={user.user_id}>

                  <td>{user.user_name}</td>
                  <td>₹{user.total_expense}</td>
                  <td>₹ {user.total_investment}</td>
                  <td>₹ {user.to_pay ? user.to_pay + '.00' : 0}</td>
                  <td>₹ {user.to_receive ? user.to_receive + '.00' : 0}</td>
                  {Logeduser.role == 1 &&
                    <td>
                      <Link className='btn-edit' to={'/user/' + user.user_id}>Inactive</Link>
                    </td>
                  }
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )



}

export default Dashboard