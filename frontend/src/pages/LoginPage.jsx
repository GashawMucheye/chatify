import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
// 1. IMPORT FIX: Import the specific useLogin hook
import { useLogin } from '../hooks/useAuth';

const LoginPage = () => {
  // 2. HOOK USAGE FIX: Call useLogin and destructure the mutation function and status
  const { mutate: login, isPending } = useLogin();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // 3. MUTATION CALL FIX: Call the destructured 'login' function
    login(formData);
  };

  return (
    <div className='w-full max-w-md'>
      <div className='card shadow-xl bg-base-200 p-8'>
        <div className='flex justify-center items-center gap-3 mb-4'>
          <CheckCircle className='h-10 w-10 text-primary' />
          <h1 className='text-3xl font-bold'>ChatApp</h1>
        </div>

        <h2 className='text-center text-2xl font-bold mb-6'>
          Login to your account
        </h2>

        <form className='space-y-4' onSubmit={handleLogin}>
          <div className='form-control'>
            <label className='label sr-only' htmlFor='email-address'>
              <span className='label-text'>Email address</span>
            </label>
            <input
              id='email-address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange} // Use combined handleChange
              autoComplete='email'
              placeholder='Email address'
              className='input input-bordered w-full'
              required
            />
          </div>

          <div className='form-control'>
            <label className='label sr-only' htmlFor='password'>
              <span className='label-text'>Password</span>
            </label>
            <input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange} // Use combined handleChange
              autoComplete='current-password'
              placeholder='Password'
              className='input input-bordered w-full'
              required
            />
          </div>

          <button
            type='submit'
            className='btn btn-primary w-full'
            // 4. LOADING STATE FIX: Use the destructured 'isPending' property
            disabled={isPending}
          >
            {isPending ? <Loader2 className='animate-spin' /> : 'Login'}
          </button>

          <div className='text-center'>
            <a href='/Signup' className='link link-primary text-sm'>
              Don't have an account? Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
