import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider';

const Investment = () => {
    const {setNotification} = useStateContext();
    const [investment, setInvestment] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getInvestment();
      }, [])


    const getInvestment = () => {
        setLoading(true);
    
        axiosClient.get('/investment/2/2023')
          .then(({ data }) => {
            setLoading(false);
            setInvestment(data.investments)
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

      const onDelete = (invest) => {
        if(!window.confirm('Are you sure you want to delete this Investment?')){
          return
        }
    
        axiosClient.delete(`/investment/${invest.id}`)
          .then(() => {
            //show notification
            setNotification('Investment was successfully deleted')
            // calling get all user funtion
            getInvestment();
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
        <div>Investment</div>
        <Link className='btn-add' to="/investment/new">Add New</Link>
      </div>
      <div className="card animated fadInDown">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Added by</th>
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
            {investment.map(invest => (
              <tr key={invest.id}>
                {/* <td>{exp.expense_date}</td> */}
                <FormattedDate dateString={invest.investment_date} />
                
                <td>{invest.added_by}</td>
                <td>₹ {invest.amount}</td>
                <td>
                  <Link className='btn-edit' to={'/investment/' + invest.id}>Edit</Link>
                  &nbsp;
                  <button onClick={ev => onDelete(invest)}  className="btn-delete">Delete</button>
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

export default Investment