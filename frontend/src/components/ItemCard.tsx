'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { BidHistoryType, ItemDataType } from '@/types/types';
import { useEffect, useState } from 'react';

export default function ItemCard({ data }: { data: ItemDataType }) {
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    const total = data.biddingHistory.reduce((sum: number, item: BidHistoryType) => sum + item.price, 0);
    setCurrentPrice(total + data.initialPrice);
  }, [data]);

  return (
    <Card className='shadow-none p-0'>
      <CardHeader className='p-0'>
        <AspectRatio ratio={9 / 5} className=''>
          <Image
            src={data.displayImg.downloadURL}
            alt='Image'
            fill
            sizes='(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw'
            className='rounded-md object-cover'
          />
        </AspectRatio>
      </CardHeader>

      <div>
        <CardContent className='p-2'>
          <Link href={`/browse/${data._id}`}>
            <CardTitle className='text-md sm:text-xl line-clamp-1'>{data.itemName}</CardTitle>
          </Link>
          <p className='text-[12px] sm:text-sm text-muted-foreground line-clamp-1'>{`${data.location.district}, ${data.location.city}, ${data.location.country}`}</p>
          <p className='mt-2 text-[12px] sm:text-sm line-clamp-1'>Bid Increment: $ {data.bidIncrement.toLocaleString()}</p>
          <p className='text-[12px] sm:text-sm line-clamp-1'>
            Price: <span className='text-sm sm:text-lg font-semibold text-blue-500 line'>$ {currentPrice.toLocaleString()}</span>
          </p>
        </CardContent>
        <Separator className='my-1' />
        <CardFooter className='p-2 flex justify-between'>
          <p className='text-[10px] sm:text-sm '>3d : 2h : 1mn</p>
          <Button asChild variant={'outline'} size={'sm'} className=' text-[10px] sm:text-sm'>
            <Link href={`/browse/${data._id}`}>Place Bid</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
