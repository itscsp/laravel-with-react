import React from 'react'
import {createBrowserRouter, Navigate} from "react-router-dom";

import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";

import DefaultLayout from "./components/DefaultLayout"
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/DashBoard";
import Expenses from './views/Expenses';


const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path:'/',
                element: <Navigate to="/expenses" />
            },
            {
                path:'/dashboard',
                element: <Dashboard />
            },
            {
                path:'/expenses',
                element:<Expenses />
            },
        ]
    },
    {
        path:'/',
        element: <GuestLayout />,
        children: [
        
            {
                path: '/login',
                element: <Login />
            },
            {
                path:'/signup',
                element:<Signup />
            },
        ]
    },

    {
        path:'*',
        element:<NotFound />
    }
])

export default router;