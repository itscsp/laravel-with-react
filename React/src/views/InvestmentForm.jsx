import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider';


const InvestmentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams()
    const { user, setNotification } = useStateContext();
    const [userslist, setUserslist] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const Logeduser = user.name

    console.log(Logeduser);

    const [investment, setInvestment] = useState(
        {
            user_id: '',
            investment_date: '',
            amount: null,
            investment_type: 'direct',
            added_by: '',
        }
    )



    if (id) {
        useEffect(() => {
            setLoading(true);

            axiosClient.get(`/investment/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    debugger
                    setInvestment(data.investment);
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    } else {
        useEffect(() => {

            setLoading(true);
            axiosClient.get(`/users`)
                .then(({ data }) => {
                    setLoading(false);
                    setUserslist(data);

                })
                .catch(() => {
                    setLoading(false)
                })


        }, [])
    }


    const onSubmit = (ev) => {
        ev.preventDefault();

        console.log(investment)
        if (id) {
            axiosClient.put(`/investment/${id}`, investment)
            .then(() => {
                //Todo show notification
                setNotification('Investment was successfully updated')
                navigate('/investment');
            })
            .catch(err => {
                const response = err.response;

                // if (response && response.status == 422) {
                    setError(response)
                // }
            })
        }else{

            axiosClient.post('/add-investment', investment)
                .then(() => {
                    setNotification('Investment was successfully created')
                    navigate('/investment')
                })
                .catch(err => {
                    const response = err.response;
                    setError(response.data.errors)
                })
        }
    }


    return (
        <>
            {id && <h1>Update Investment</h1>}
            {!id && <h1>New Investment</h1>}
            <div className="card animated fadeInDown">
                {loading &&
                    <div className="text-center">
                        Loading..
                    </div>
                }
                {
                    error &&
                    <div className='alert'>
                        {Object.keys(error).map(key => (
                            <p key={key}>{error[key][0]}</p>
                        ))}
                    </div>

                }

                {
                    !loading &&
                    <form onSubmit={onSubmit}>

                        <input type='date' placeholder='Investment date'
                            value={investment.investment_date}

                            onChange={ev => setInvestment(
                                {
                                    ...investment, investment_date: ev.target.value,
                                }
                            )}

                        />


                        <input type="number" placeholder='amount'
                            value={investment.amount}

                            onChange={ev => setInvestment(
                                {
                                    ...investment, amount: ev.target.value,
                                }
                            )}
                        />
                        {!id &&
                        
                        <select onChange={ev => setInvestment(
                            {
                                ...investment, user_id: ev.target.value, added_by: Logeduser
                            }
                        )
                        }
                        >
                            <option>Select user for investment</option>

                            {userslist.map(usr => (
                                <option key={usr.id} value={usr.id}>{usr.name}</option>
                            ))}



                        </select>
                        }



                        <button className='btn'>Save</button>

                    </form>


                }
            </div>
        </>

    )
}

export default InvestmentForm