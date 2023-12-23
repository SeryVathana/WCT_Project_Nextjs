'use client';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ItemCard() {
  return (
    <Card className=' shadow-none p-0'>
      <CardHeader className='p-0'>
        <AspectRatio ratio={9 / 5} className=''>
          <Image
            src='https://images.unsplash.com/photo-1703136678192-53fda2c5c602?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8'
            alt='Image'
            className='rounded-md object-cover h-full'
            fill
            priority
            sizes='100'
          />
        </AspectRatio>
      </CardHeader>

      <div>
        <CardContent className='p-2'>
          <Link href={'/browse/1'}>
            <CardTitle className='text-md sm:text-xl'>Dawgy Original</CardTitle>
          </Link>
          <p className='text-[12px] sm:text-sm text-muted-foreground'>Siem Reap | Cambodia</p>
          <p className='mt-2 text-[12px] sm:text-sm '>Bid Increment: $100</p>
          <p className='text-[12px] sm:text-sm '>
            Current Price:{' '}
            <span className='text-sm sm:text-lg font-semibold text-blue-500'>$1299</span>
          </p>
        </CardContent>
        <Separator className='my-1' />
        <CardFooter className='p-2 flex justify-between'>
          <p className='text-[10px] sm:text-sm '>3d : 2h : 1mn</p>
          <Button asChild variant={'outline'} size={'sm'} className=' text-[10px] sm:text-sm'>
            <Link href={'/browse/1'}>Place Bid</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
