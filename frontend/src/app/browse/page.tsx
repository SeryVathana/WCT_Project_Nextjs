'use client';

import CardsContainer from '@/components/CardsContainer';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';

import { PRODUCT_CATEGORIES } from '@/data/List';
import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Browse = () => {
  return (
    <MaxWidthWrapper className='grid grid-cols-12 my-10 lg:px-10 xl:px-2 gap-5'>
      <div className='hidden md:flex md:flex-col md:col-span-3 xl:col-span-2 border-r mr-0 lg:mr-2 xl:mr-5 overflow-hidden'>
        <h3 className='text-lg font-semibold'>Categories</h3>
        <ul className='mt-5 flex flex-col'>
          {PRODUCT_CATEGORIES.map((category) => (
            <li
              key={category}
              className={cn(
                buttonVariants({ variant: 'link' }),
                'justify-start p-0 cursor-pointer'
              )}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div className='col-span-12 md:col-span-9 xl:col-span-10 md:ml-1'>
        <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between'>
          <h1 className=' text-2xl font-semibold'>All Items</h1>
          <div className='flex gap-2 mt-5 sm:mt-0'>
            <div className='block md:hidden'>
              <p className='mb-2'>Categories:</p>
              <Select defaultValue='all'>
                <SelectTrigger className='w-[150px] md:w-[180px]'>
                  <SelectValue placeholder='Sort By' />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className='mb-2'>Sort By:</p>
              <Select defaultValue='default'>
                <SelectTrigger className='w-[100px] md:w-[180px]'>
                  <SelectValue placeholder='Sort By' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='default'>Default</SelectItem>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                  <SelectItem value='oldest'>Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <CardsContainer className='mt-5 md:grid-cols-2' />
      </div>
    </MaxWidthWrapper>
  );
};

export default Browse;
