import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React from 'react';

const NotFound = () => {
  return (
    <MaxWidthWrapper className='flex flex-col justify-center items-center min-h-[80vh]'>
      <h1 className='text-8xl tracking-wider text-red-500'>404</h1>
      <h6 className='text-xl'>Page Not Found</h6>
    </MaxWidthWrapper>
  );
};

export default NotFound;
