'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '@/redux/features/auth-slice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/redux/store';

const SignIn = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  const dispatch = useDispatch();
  const router = useRouter();

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(logIn({ username: 'Sery Vathana', email: values.email }));
    router.push('/');
    console.log(values);
  }

  useEffect(() => {
    if (user.isAuth) {
      console.log(user);

      router.push('/');
    }
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
      </div>
    </MaxWidthWrapper>
  );
};

export default SignIn;
