import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { ItemDataType } from '@/types/types';

export default function ItemCard({ data }: { data: ItemDataType }) {
  return (
    <Card className='shadow-none p-0'>
      <CardHeader className='p-0'>
        <AspectRatio ratio={9 / 5} className=''>
          <Image src={data.displayImg.downloadURL} alt='Image' fill priority sizes='100' className='rounded-md object-cover' />
        </AspectRatio>
      </CardHeader>

      <div>
        <CardContent className='p-2'>
          <Link href={`/browse/${data._id}`}>
            <CardTitle className='text-md sm:text-xl'>{data.itemName}</CardTitle>
          </Link>
          <p className='text-[12px] sm:text-sm text-muted-foreground'>{`${data.location.district}, ${data.location.city}, ${data.location.country}`}</p>
          <p className='mt-2 text-[12px] sm:text-sm '>Bid Increment: ${data.bidIncrement}</p>
          <p className='text-[12px] sm:text-sm '>
            Current Price: <span className='text-sm sm:text-lg font-semibold text-blue-500'>$1299</span>
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
