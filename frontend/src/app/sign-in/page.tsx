'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { Ref, useEffect, useRef, useState } from 'react';
import { auth } from '../../configs/firebase-config';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState<boolean>(false);
  const errorRef = useRef<Ref<HTMLParagraphElement>>();

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(false);
    await signInWithEmailAndPassword(auth, values.email, values.password)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setError(true);
      });
  };

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
            {error && <AlertDestructive />}
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

function AlertDestructive() {
  return (
    <Alert variant='destructive'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Email or Password is not correct.</AlertDescription>
    </Alert>
  );
}
