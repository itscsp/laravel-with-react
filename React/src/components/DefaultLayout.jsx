import React from 'react'
import { useEffect } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom'
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider'

const DefaultLayout = () => {

    
    const { user, token, notification, setUser, setToken } = useStateContext();

    // console.log('Checking for user', user)

    if (!token) {
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
        .then(({data}) => {
            setUser(data)
        })
        
    }, [])
    
    // console.log('Checking for user 3',user)

    return (
        <div id='defaultLayout'>
            <aside>
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/expenses'>Expenses</Link>
                <Link to='/investment'>Investment</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Room Expenses Tracker
                    </div>
                    <div>
                        {user.name}
                        <a href='#' className="btn-logout" onClick={onLogout}>Logout</a>
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