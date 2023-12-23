'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { useEffect, useState } from 'react';
import { log } from 'console';
import { Checkbox } from '@/components/ui/checkbox';

const SignUp = () => {
  const formSchema = z.object({
    firstname: z.string().min(2).max(10),
    lastname: z.string().min(2).max(10),
    email: z.string().email(),
    password: z.string().min(6),
    phonenumber: z.string().min(6),
    birthdate: z.string().refine((date) => new Date(date).getFullYear() <= 2023 - 18, {
      message: 'You must be 18 or above to join bidding.',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <MaxWidthWrapper className='flex items-center justify-center min-h-[80vh] my-10'>
      <div className='w-[90%] md:w-[500px] xl:w-[500px]'>
        <h1 className='text-center text-3xl font-semibold'>Create an account</h1>
        <h1 className='text-center text-2xl font-semibold my-5'>Join us now</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 '>
            <div className='flex gap-5'>
              <FormField
                control={form.control}
                name='firstname'
                render={({ field }) => (
                  <div className='flex-grow'>
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl className='flex-1 flex-grow'>
                        <Input placeholder='Uzumaki' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='lastname'
                render={({ field }) => (
                  <div className='flex-grow'>
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl className=''>
                        <Input placeholder='Naruto' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>
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
                      <Input placeholder='Password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name='phonenumber'
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl className=''>
                      <Input placeholder='+000-000-000' type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name='birthdate'
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl className=''>
                      <Input placeholder='+855-00-000-000' type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <div className='items-top flex space-x-2'>
              <Checkbox id='terms1' required />
              <div className='grid gap-1.5 leading-none'>
                <label
                  htmlFor='terms1'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Accept terms and conditions
                </label>
              </div>
            </div>
            <div className=' w-full flex justify-center py-5'>
              <Button type='submit'>Sign Up</Button>
            </div>
          </form>
        </Form>
      </div>
    </MaxWidthWrapper>
  );
};

export default SignUp;
