import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SignUpPage = () => {
  const { signupMutation } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  return (
    <div className='min-h-screen bg-base-100 text-base-content dark:bg-background-dark flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <div className='card shadow-xl bg-base-200 p-8'>
          <div className='flex justify-center items-center gap-3 mb-4'>
            <CheckCircle className='h-10 w-10 text-primary' />
            <h1 className='text-3xl font-bold'>ChatApp</h1>
          </div>

          <h2 className='text-center text-2xl font-bold mb-6'>
            Create your account
          </h2>

          <form className='space-y-4' onSubmit={handleSignUp}>
            <div className='form-control'>
              <input
                id='fullName'
                name='fullName'
                type='text'
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder='Full name'
                className='input input-bordered w-full'
              />
            </div>

            <div className='form-control'>
              <input
                id='email-address'
                name='email'
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder='Email address'
                className='input input-bordered w-full'
                required
              />
            </div>

            <div className='form-control'>
              <input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder='Password'
                className='input input-bordered w-full'
                required
              />
            </div>

            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? (
                <Loader2 className='animate-spin' />
              ) : (
                'Sign Up'
              )}
            </button>

            <div className='text-center'>
              <a href='/login' className='link link-primary text-sm'>
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
