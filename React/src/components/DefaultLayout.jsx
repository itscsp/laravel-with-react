import React from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider'

const DefaultLayout = () => {
    const { user, token, setUser, setToken } = useStateContext();



    if (!token) {
        return <Navigate to="/login" />
    }



    const onLogout = (ev) => {
        ev.preventDefault()

        debugger;
        const payload = {
            user: user,
            token: token
        }


        axiosClient.post('/logout')
            .then(() => {
                setUser();
                setToken();
            })
            
        // console.log(response)
    }

    return (
        <div id='defaultLayout'>
            <aside>
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/users'>Users</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        {user.name}
                        <a href='#' className="btn-logout" onClick={onLogout}>Logout</a>
                    </div>
                </header>
                <main>

                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DefaultLayout