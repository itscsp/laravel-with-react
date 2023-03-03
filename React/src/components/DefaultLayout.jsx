import React from 'react'
import { useEffect } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom'
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider'

const DefaultLayout = () => {


    const { user, token, notification, setUser, setToken } = useStateContext();

    // console.log('Checking for user', user)

    if (!token && user) {
        return <Navigate to="/login" />
    }



    const onLogout = (ev) => {
        ev.preventDefault()


        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
            })

        // console.log(response)
    }
    // console.log('Checking for user 2',user)

    useEffect(() => {

        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data)
            })

    }, [])

    // console.log('Checking for user 3',user)

    return (
        <div id='defaultLayout'>
            <aside>
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/expenses'>Expenses</Link>
                {user.role == 1 &&
                    <Link to='/investment'>Investment</Link>
                }

                {user.role == 1 &&
                    <Link  to="/user/new">Add Member</Link>
                }
                 <a href='#' className="btn-logout" onClick={onLogout}>Logout</a>

            </aside>
            <div className="content">
                <header>
                    <div>
                        <h1>Room Expenses Tracker</h1>
                    </div>
                    <div>
                        Hi, {user.name}
                    </div>
                </header>
                <main>

                    <Outlet />
                </main>

                {notification &&
                    <div className="notification">
                        {notification}
                    </div>
                }
            </div>
        </div>
    )
}

export default DefaultLayout