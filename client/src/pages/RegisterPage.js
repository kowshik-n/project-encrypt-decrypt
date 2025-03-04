import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data,setData] = useState({
    name : "",
    email : "",
    password : "",
    profile_pic : ""
  })
  const [uploadPhoto,setUploadPhoto] = useState("")
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

  const handleUploadPhoto = async(e)=>{
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setUploadPhoto(file)

    setData((preve)=>{
      return{
        ...preve,
        profile_pic : uploadPhoto?.url
      }
    })
  }
  const handleClearUploadPhoto = (e)=>{
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
        const response = await axios.post(URL,data)
        console.log("response",response)

        toast.success(response.data.message)

        if(response.data.success){
            setData({
              name : "",
              email : "",
              password : "",
              profile_pic : ""
            })

            navigate('/email')

        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
    console.log('data',data)
  }


  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4'>
        <div className='bg-white w-full max-w-md rounded-lg shadow-xl p-8 mx-auto'>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-2'>Create Account</h2>
          <p className='text-center text-gray-600 mb-6'>Join our chat community today</p>

          <form className='space-y-6' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <label htmlFor='name' className='text-sm font-medium text-gray-700'>Full Name</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='John Doe' 
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                />
              </div>

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

              <div className='space-y-2'>
                <label htmlFor='password' className='text-sm font-medium text-gray-700'>Password</label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='••••••••' 
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='profile_pic' className='text-sm font-medium text-gray-700'>Profile Photo</label>
                <div 
                  className='relative h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary cursor-pointer transition-colors flex items-center justify-center'
                  onClick={() => document.getElementById('profile_pic').click()}
                >
                    <p className='text-sm text-gray-600 max-w-[300px] text-ellipsis line-clamp-1 px-4'>
                      {uploadPhoto?.name ? uploadPhoto?.name : "Click to upload profile photo"}
                    </p>
                    {uploadPhoto?.name && (
                      <button 
                        className='absolute right-2 p-1 hover:bg-gray-200 rounded-full transition-colors'
                        onClick={handleClearUploadPhoto}
                      >
                        <IoClose className='text-gray-600'/>
                      </button>
                    )}
                </div>
                
                <input
                  type='file'
                  id='profile_pic'
                  name='profile_pic'
                  className='hidden'
                  onChange={handleUploadPhoto}
                />
              </div>

              <button
               className='w-full bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-300 shadow-lg hover:shadow-xl'
              >
                Create Account
              </button>
          </form>

          <p className='mt-8 text-center text-gray-600'>
            Already have an account? {' '}
            <Link to={"/email"} className='text-primary hover:text-secondary font-semibold transition-colors'>
              Sign in
            </Link>
          </p>
        </div>
    </div>
  )
}

export default RegisterPage
