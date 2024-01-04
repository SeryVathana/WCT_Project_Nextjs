'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { logIn } from '@/redux/features/auth-slice';
import { redirect, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { Separator } from '@/components/ui/separator';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { auth, provider } from '../../configs/firebase-config';
import axios from 'axios';

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await signInWithEmailAndPassword(auth, values.email, values.password);
    console.log(user);

    // axios.post('http://localhost:5000/user/sign-in-with-email', { ...values }).then((userCred) => {
    //   console.log(userCred);
    // });
    // dispatch(logIn({ username: 'Sery Vathana', email: values.email }));
  }

  useEffect(() => {
    auth.onAuthStateChanged(async (userCred) => {
      if (userCred) {
        router.push('/');
      }
    });
  });

  return (
    <MaxWidthWrapper className='flex items-center justify-center min-h-[80vh]'>
      <div className='w-[90%] md:w-[500px] xl:w-[500px]'>
        <h1 className='text-center text-3xl font-semibold'>Welcome Back</h1>
        <h1 className='text-center text-2xl font-semibold my-5'>Sign In</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 '>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl className=''>
                      <Input placeholder='Email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl className=''>
                      <Input placeholder='password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <div className=' w-full flex justify-center'>
              <Button type='submit'>Sign In</Button>
            </div>
          </form>
        </Form>
        {/* <div className='flex items-center w-full justify-between my-10'>
          <Separator orientation='horizontal' className='w-2/5' />
          <h1>or</h1>
          <Separator orientation='horizontal' className='w-2/5' />
        </div>
        <Button variant='outline' onClick={loginWithGoogle} className='w-full flex items-center gap-5'>
          <div className=' text-lg'>
            <FcGoogle />
          </div>
          <span>Sign in with Google</span>
        </Button> */}
      </div>
    </MaxWidthWrapper>
  );
};

export default SignIn;
