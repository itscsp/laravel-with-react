import React, { useEffect, useState } from 'react'
import axiosClient from '../axiosClient';

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);

    axiosClient.get('/users')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data)
        // console.log(data)

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

      </div>
      <div className="card animated fadInDown">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Total Expense</th>
              <th>Total Investment</th>
              <th>Balance to pay</th>
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
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>₹ 000</td>
                  <td>₹ 000</td>
                  <td>₹ 000</td>
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