import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiLockClosed } from 'react-icons/hi'

const Forgotpassword = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add forgot password logic here
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4'>
      <div className='bg-white w-full max-w-md rounded-lg shadow-xl p-8 mx-auto'>
        <div className='flex flex-col items-center mb-6'>
          <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4'>
            <HiLockClosed className='text-primary w-8 h-8' />
          </div>
          <h2 className='text-3xl font-bold text-gray-800'>Reset Password</h2>
          <p className='text-gray-600 mt-2 text-center'>
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <label htmlFor='email' className='text-sm font-medium text-gray-700'>Email Address</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors'
              placeholder='you@example.com'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-300 shadow-lg hover:shadow-xl'
          >
            Send Reset Instructions
          </button>
        </form>

        <p className='mt-8 text-center text-gray-600'>
          Remember your password? {' '}
          <Link to={"/email"} className='text-primary hover:text-secondary font-semibold transition-colors'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Forgotpassword
