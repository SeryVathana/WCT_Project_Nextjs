'use client';

import React, { useEffect } from 'react';

import { buttonVariants } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlignJustify } from 'lucide-react';

import { cn } from '@/lib/utils';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { logIn, logOut } from '@/redux/features/auth-slice';
import { signOut } from 'firebase/auth';
import { auth } from '@/configs/firebase-config';
import { useAuth } from '@/customHooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const NAVLINK = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Browse',
    href: '/browse',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

const NavActions = () => {
  useAuth();
  const user = useSelector((state: RootState) => state.authSlice.value);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    router.push('/sign-in');
    dispatch(logOut());
    signOut(auth);
  };

  return (
    <>
      <div className='hidden lg:flex lg:items-center lg:ml-auto'>
        <div></div>
        {user.isAuth ? null : (
          <>
            <Link href={'/sign-up'} className={buttonVariants({ variant: 'ghost' })}>
              Create an account
            </Link>
            <div className='h-10 w-px bg-gray-200 mx-3' />
          </>
        )}
        {user.isAuth ? null : (
          <>
            <Link href={'/sign-in'} className={buttonVariants({ variant: 'ghost' })}>
              Sign In
            </Link>
          </>
        )}

        {!user.isAuth ? null : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn('flex items-center gap-2', buttonVariants({ variant: 'ghost' }))}>
                <Avatar className='w-8 h-8 border'>
                  <AvatarImage src={user.userPfURL} className=' object-cover' sizes='100px' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {user.username}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/create-post')}>Create Post</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <Sheet>
        <SheetTrigger className='block lg:hidden ml-auto'>
          <AlignJustify />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader></SheetHeader>
          <div className='flex flex-col text-center mt-5'>
            {NAVLINK.map((link) => {
              return (
                <Link key={link.label} href={link.href} className='transition-all hover:opacity-50 text-lg py-5'>
                  <SheetTrigger>{link.label}</SheetTrigger>
                </Link>
              );
            })}
            <Separator />
            {user.isAuth ? null : (
              <SheetTrigger className='transition-all hover:opacity-50 text-lg py-5'>
                <Link href={'/sign-in'}>Sign In</Link>
              </SheetTrigger>
            )}
            {user.isAuth ? null : (
              <SheetTrigger className='transition-all hover:opacity-50 text-lg py-5'>
                <Link href={'/sign-up'}>Create an account</Link>
              </SheetTrigger>
            )}
            {!user.isAuth ? null : (
              <SheetTrigger className='transition-all hover:opacity-50 text-lg py-5'>
                <Link href={'/profile'}>Profile</Link>
              </SheetTrigger>
            )}

            {!user.isAuth ? null : (
              <SheetTrigger className='transition-all hover:opacity-50 text-lg py-5'>
                <Link href={'/create-post'}>Create Post</Link>
              </SheetTrigger>
            )}

            {!user.isAuth ? null : (
              <SheetTrigger
                onClick={() => handleLogout()}
                className='transition-all hover:opacity-50 text-lg py-5 cursor-pointer'
              >
                Log out
              </SheetTrigger>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NavActions;
