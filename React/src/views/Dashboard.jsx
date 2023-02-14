import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider';

const Dashboard = () => {

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const prsentMonth = currentMonth + "/" + currentYear;

  const [users, setUsers] = useState([])
  const [total_expense, setTotal_expense] = useState()
  const [total_investment, setTotal_invesment] = useState()
  const [monthList, setMonthList] = useState([])
  const [activeMonth, setActiveMonth] = useState(prsentMonth)
  const { user } = useStateContext();

  const Logeduser = user

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    setLoading(true);

    axiosClient.get(`/monthly-totals/${activeMonth}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.result);
        setTotal_expense(data.Total_expense_of_month);
        setTotal_invesment(data.Total_investment_of_month);
        setMonthList(data.Month_list);

      })
      .catch(() => {
        setLoading(false)
      })

    console.log(activeMonth)

  }, [activeMonth])






  const changeMonth = event => {
    setActiveMonth(event.target.value);
  };

  const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const width = {
    width: '300px'
  }

  return (
    <div>
      <div style={flex}>
        <div>
          <p>Total Monthly Expenses : {total_expense}</p>
          <p>Total Monthly Direct Investment: {total_investment ? total_investment : 'No direct investment'}</p>
        </div>


          <select style={width} onChange={e => changeMonth(e)}>
            {monthList.map((item, index) => (
              <option key={index} value={item.value}>{item.label}</option>
            ))}

          </select>
        <div style={flex}>

          {Logeduser.role == 1 &&
            <Link className='btn-add block' to="/user/new">Add New</Link>
          }
        </div>


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