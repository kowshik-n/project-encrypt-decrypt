import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";

const CheckEmailPage = () => {
  const [data,setData] = useState({
    email : "",
  })
  const navigate = useNavigate()

  const handleOnChange = (e)=>{
    const { name, value} = e.target

    setData((preve)=>{
      return{
          ...preve,
          [name] : value
      }
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
        const response = await axios.post(URL,data)

        toast.success(response.data.message)

        if(response.data.success){
            setData({
              email : "",
            })
            navigate('/password',{
              state : response?.data?.data
            })
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4'>
        <div className='bg-white w-full max-w-md rounded-lg shadow-xl p-8 mx-auto'>
            <div className='flex flex-col items-center mb-6'>
                <PiUserCircle
                  className='text-primary/80'
                  size={90}
                />
                <h2 className='text-3xl font-bold text-gray-800 mt-4'>Welcome Back!</h2>
                <p className='text-gray-600 mt-2'>Sign in to continue to Chat App</p>
            </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium text-gray-700'>Email Address</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='you@example.com' 
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <button
               className='w-full bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-300 shadow-lg hover:shadow-xl'
              >
                Continue
              </button>
          </form>

          <p className='mt-8 text-center text-gray-600'>
            New to Chat App? {' '}
            <Link to={"/register"} className='text-primary hover:text-secondary font-semibold transition-colors'>
              Create an account
            </Link>
          </p>
        </div>
    </div>
  )
}

export default CheckEmailPage
