import React, { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data,setData] = useState({
    password : "",
    userId : ""
  })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!location?.state?.name){
      navigate('/email')
    }
  },[])

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
        const response = await axios({
          method :'post',
          url : URL,
          data : {
            userId : location?.state?._id,
            password : data.password
          },
          withCredentials : true
        })

        toast.success(response.data.message)

        if(response.data.success){
            dispatch(setToken(response?.data?.token))
            localStorage.setItem('token',response?.data?.token)

            setData({
              password : "",
            })
            navigate('/')
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4'>
        <div className='bg-white w-full max-w-md rounded-lg shadow-xl p-8 mx-auto'>
            <div className='flex flex-col items-center mb-6'>
                <Avatar
                  width={80}
                  height={80}
                  name={location?.state?.name}
                  imageUrl={location?.state?.profile_pic}
                  className="ring-4 ring-primary/10"
                />
                <h2 className='text-2xl font-bold text-gray-800 mt-4'>{location?.state?.name}</h2>
                <p className='text-gray-500 text-sm mt-1'>{location?.state?.email}</p>
            </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <label htmlFor='password' className='text-sm font-medium text-gray-700'>Password</label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Enter your password' 
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <button
               className='w-full bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-300 shadow-lg hover:shadow-xl'
              >
                Sign In
              </button>
          </form>

          <div className='mt-6 text-center'>
            <Link 
              to={"/forgot-password"} 
              className='text-primary hover:text-secondary font-semibold transition-colors text-sm'
            >
              Forgot your password?
            </Link>
          </div>
        </div>
    </div>
  )
}

export default CheckPasswordPage

