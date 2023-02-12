import React from 'react'
import {createBrowserRouter, Navigate} from "react-router-dom";

import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";

import DefaultLayout from "./components/DefaultLayout"
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import Expenses from './views/Expenses';
import ExpenseForm from './views/ExpenseForm';
import UserForm from './views/UserForm';
import Investment from './views/Investment';
import InvestmentForm from './views/InvestmentForm';


const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path:'/',
                exact: true,
                element: <Navigate to="/dashboard" />
            },
            {
                path:'/dashboard',
                exact: true,
                element: <Dashboard />
            },
            {
                path:'/expenses',
                exact: true,
                element:<Expenses />
            },
            {
                path:'/expenses/:id',
                element:<ExpenseForm key="expenseUpdate" />
            },
            {
                path:'/expenses/new',
                element:<ExpenseForm key="expenseCreate" />
            },

            {
                path:'/investment',
                exact: true,
                element:<Investment />
            },
            {
                path:'/investment/:id',
                element:<InvestmentForm key="investmentUpdate" />
            },
            {
                path:'/investment/new',
                element:<InvestmentForm key="investmentCreate" />
            },
            

            {
                path:'/user/new',
                element:<UserForm key="userCreate" />
            },

            {
                path:'/user/:id',
                element:<UserForm key="userUpdate" />
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
        ]
    },

    {
        path:'*',
        element:<NotFound />
    }
])

export default router;