import React, { useEffect } from 'react'
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const StateContext = createContext({
    user:null,
    token:null,
    notification:null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {}
})

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [notification, _setNotification] = useState('')

    const setNotification = (message) => {
        _setNotification(message);

        setTimeout(() => {
            _setNotification('')
        }, 5000)
    }

    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {

        _setToken(token)
    
        if(token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');

        }

    }
    
    useEffect(() => {
        // debugger
        if(user && user.id){
            localStorage.setItem('CURRENT_USER_ID',user.id)
        }else if(!user.id){
            localStorage.removeItem('CURRENT_USER_ID');
        }
    },[user])

    return (
        <StateContext.Provider value={
            {
                user,
                token,
                notification,
                setUser,
                setToken,
                setNotification
            }
        } >
            {children}
        
        </StateContext.Provider >

    )
}

export const useStateContext = () => useContext(StateContext);