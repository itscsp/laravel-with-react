import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';

const Dashboard = () => {
  const [users, setUsers] = useState([])
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);

    axiosClient.get('/monthly-totals/2/2023')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.result)
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
        <div>Users</div>
        <Link className='btn-add' to="/user/new">Add New</Link>

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
              {users.map(user => (
                <tr key={user.user_id}>
                
                  <td>{user.user_name}</td>
                  <td>₹{user.total_expense}</td>
                  <td>₹ {user.total_investment}</td>
                  <td>₹ {user.to_pay ? user.to_pay+'.00' : 0 }</td>
                  <td>₹ {user.to_receive ? user.to_receive+'.00' : 0}</td>
                  <td>
                  <Link className='btn-edit' to={'/user/'+user.user_id}>Inactive</Link>
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

export default Dashboard