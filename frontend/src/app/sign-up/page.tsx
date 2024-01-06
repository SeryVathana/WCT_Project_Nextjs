'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { auth } from '@/configs/firebase-config';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { logIn } from '@/redux/features/auth-slice';
import { useDispatch } from 'react-redux';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Search } from 'lucide-react';
import { sendEmail } from '../sendEmail';

const API_URL = 'https://auction-site-server.onrender.com';

const formSchema = z.object({
  firstname: z.string().min(2).max(10),
  lastname: z.string().min(2).max(10),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be 6 or more characters.'),
});

const SignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [birthDate, setBirthDate] = useState<string>('');
  const [errorBirthDate, setErrorBirthDate] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged(async (userCred) => {
      if (userCred) {
        router.push('/');
      }
    });
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (new Date(Date.now()).getFullYear() - new Date(birthDate).getFullYear() < 18) {
      setErrorBirthDate(true);
      return;
    } else {
      setErrorBirthDate(false);
      setLoading(true);
    }

    await createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (newUser) => {
        const reqBody = {
          ...values,
          photoURL:
            'https://www2.deloitte.com/content/dam/Deloitte/nl/Images/promo_images/deloitte-nl-cm-digital-human-promo.jpg',
          birthDate: new Date(birthDate).toISOString(),
          uid: newUser.user.uid,
          isModerator: false,
        };

        await axios.post(`${API_URL}/user/create-user`, { ...reqBody }).then(async (uploadedUserInfo) => {
          dispatch(
            logIn({
              uid: uploadedUserInfo.data._id,
              username: uploadedUserInfo.data.displayName,
              email: uploadedUserInfo.data.email,
              token: await newUser.user.getIdToken(),
              pfURL: uploadedUserInfo.data.photoURL,
              isModerator: uploadedUserInfo.data.isModerator,
            })
          );
        });
      })
      .catch((err) => {
        if (err.code == 'auth/email-already-in-use') {
          setEmailError(true);
        }
      });
    setLoading(false);
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

            <div className='space-y-2'>
              <Label className={errorBirthDate ? 'text-destructive' : ''}>Birth Date</Label>
              <Input
                placeholder='End Date'
                type='date'
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                }}
                className='col-span-3'
              />

              {errorBirthDate && (
                <p className='text-sm font-medium text-destructive'>User must be 18 or above to join bidding.</p>
              )}
            </div>

            <div className='items-top flex space-x-2'>
              <Checkbox id='terms1' />
              <div className='grid gap-1.5 leading-none'>
                <label
                  htmlFor='terms1'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Accept terms and conditions
                </label>
              </div>
            </div>
            {emailError && <AlertDestructive />}
            <div className=' w-full flex justify-center py-5'>
              <Button type='submit' disabled={loading}>
                {!loading ? 'Sign Up' : 'Loading'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MaxWidthWrapper>
  );
};

export default SignUp;

function AlertDestructive() {
  return (
    <Alert variant='destructive'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Email is already in use.</AlertDescription>
    </Alert>
  );
}
