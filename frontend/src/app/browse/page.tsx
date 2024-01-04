import CardsContainer from '@/components/CardsContainer';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';

import { PRODUCT_CATEGORIES } from '@/data/List';
import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const getItems = async () => {
  const res = await fetch('http://localhost:5000/api/posts', { cache: 'no-store' });
  const data = await res.json();

  return data;
};

const Browse = async () => {
  const data = await getItems();

  return (
    <MaxWidthWrapper className='my-10 px-5 xl:px-20 gap-5 min-h-[70vh]'>
      <div className=' xl:col-span-10 md:ml-1'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <h1 className=' text-2xl font-semibold'>All Items</h1>
          <div className='flex gap-2 mt-5 sm:mt-0'>
            <div className=''>
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

        <CardsContainer data={data} className='mt-5 md:grid-cols-2' />
      </div>
    </MaxWidthWrapper>
  );
};

export default Browse;
