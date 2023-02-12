import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/ContextProvider';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setNotification } = useStateContext()

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: null,
    status: null,
    senderEmail: '',
    senderPassword: ''
  })

  if (id) {
    useEffect(() => {
      setLoading(true);

      axiosClient.get(`/user/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
          console.log(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (!id) {

      axiosClient.post('/signup', user)
        .then(({ data }) => {

          navigate('/dashboard')

        })
        .catch(err => {
          const response = err.response;

          if (response && response.status == 422) {
            setError(response.data.errors)
          }
        })
    } else {
      
      if (user.status == 0) {
        if (!window.confirm('Are you sure you want to inactivate this user?')) {
          return
        }
        axiosClient.put(`/users/${id}`)
          .then(() => {
            //show notification
            setNotification('User is inactivated')
            navigate('/dashboard')
          })
      }

    }

  }


  return (
    <>
      <div className="card animated fadeInDown">
        {loading &&
          <div className="text-center">
            Loading..
          </div>
        }

        {error &&
          <div className='alert'>
            {Object.keys(error).map(key => (
              <p key={key}>{error[key][0]}</p>
            ))}
          </div>

        }

        {!loading && !id &&
          <form onSubmit={onSubmit}>

            <input type='text' value={user.name}

              onChange={ev => setUser(
                {
                  ...user, name: ev.target.value,
                }
              )
              } placeholder='User Name'
            />

            <input type="email" value={user.email}

              onChange={ev => setUser(
                {
                  ...user, email: ev.target.value,
                }
              )
              } placeholder='User email'
            />

            <input type={id ? 'passowrd' : 'text'} value={user.password}

              onChange={ev => setUser(
                {
                  ...user, password: ev.target.value, password_confirmation: ev.target.value
                }
              )
              } placeholder={id ? '**************' : 'Create user password'}
            />

            <select onChange={ev => setUser(
              {
                ...user, role: ev.target.value,
              }
            )
            }
            >
              {!user.role &&
                <>
                  <option value="0">Member</option>
                  <option selected> Select User Role</option>
                </>
              }

              {user.role &&
                <option value={user.role}> {user.role == 0 ? 'Member' : 'Admin'}</option>
              }

              {user.role == 0 &&
                <option value='1'>Admin</option>
              }

              {user.role == 1 &&
                <option value='0'>Member</option>
              }



            </select>

            <select onChange={ev => setUser(
              {
                ...user, status: ev.target.value,
              }
            )
            }
            >
              {!user.status &&
                <>
                  <option value="0">Inactive</option>
                  <option selected> Select User Status</option>
                </>
              }

              {user.status &&
                <option value={user.status}> {user.status == 0 ? 'Inactive' : 'Active'}</option>
              }

              {user.status == 0 &&
                <option value='1'>Active</option>
              }

              {user.status == 1 &&
                <option value='0'>Inactive</option>
              }

            </select>


            <button className='btn'>Save</button>

          </form>
        }

        {id &&
          <form onSubmit={onSubmit}>

            <select onChange={ev => setUser(
              {
                ...user, status: ev.target.value,
              }
            )
            }
            >
              {!user.status &&
                <>
                  <option value="0">Inactive</option>
                  <option selected> Select User Status</option>
                </>
              }

              {user.status &&
                <option value={user.status}> {user.status == 0 ? 'Inactive' : 'Active'}</option>
              }

              {user.status == 0 &&
                <option value='1'>Active</option>
              }

              {user.status == 1 &&
                <option value='0'>Inactive</option>
              }

            </select>


            <button type='button' className={user.status == 1 ? 'btn disabled' : 'btn'}>Save</button>

          </form>
        }
      </div>
    </>
  )
}

export default UserForm