import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
// 1. IMPORT: Import the specific useSignup hook
import { useSignup } from '../hooks/useAuth';

const SignUpPage = () => {
  // 2. HOOK USAGE: Call useSignup and destructure the mutation function (renamed to 'signup') and status (isPending)
  const { mutate: signup, isPending } = useSignup();

  const [formData, setFormData] = useState({
    fullName: '',
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

  const handleSignUp = (e) => {
    e.preventDefault(); // 3. MUTATION CALL: Call the destructured 'signup' function with the form data
    signup(formData);
  };

  return (
    <div className='w-full max-w-md'>
           {' '}
      <div className='card shadow-xl bg-base-200 p-8'>
               {' '}
        <div className='flex justify-center items-center gap-3 mb-4'>
                    <CheckCircle className='h-10 w-10 text-primary' />         {' '}
          <h1 className='text-3xl font-bold'>ChatApp</h1>       {' '}
        </div>
               {' '}
        <h2 className='text-center text-2xl font-bold mb-6'>
                    Create your account        {' '}
        </h2>
               {' '}
        <form className='space-y-4' onSubmit={handleSignUp}>
                   {' '}
          <div className='form-control'>
                       {' '}
            <input
              id='fullName'
              name='fullName'
              type='text'
              value={formData.fullName}
              onChange={handleChange}
              placeholder='Full name'
              className='input input-bordered w-full'
            />
                     {' '}
          </div>
                   {' '}
          <div className='form-control'>
                       {' '}
            <input
              id='email-address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email address'
              className='input input-bordered w-full'
              required
            />
                     {' '}
          </div>
                   {' '}
          <div className='form-control'>
                       {' '}
            <input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              className='input input-bordered w-full'
              required
            />
                     {' '}
          </div>
                   {' '}
          <button
            type='submit'
            className='btn btn-primary w-full' // 4. LOADING STATE: Use the destructured 'isPending' property
            disabled={isPending}
          >
                       {' '}
            {isPending ? <Loader2 className='animate-spin' /> : 'Sign Up'}     
               {' '}
          </button>
                   {' '}
          <div className='text-center'>
                       {' '}
            <a href='/login' className='link link-primary text-sm'>
                            Already have an account? Login            {' '}
            </a>
                     {' '}
          </div>
                 {' '}
        </form>
             {' '}
      </div>
         {' '}
    </div>
  );
};

export default SignUpPage;
