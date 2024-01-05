import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Skeleton } from './ui/skeleton';

export default function ItemCardSkeleton() {
  return (
    <Card className='shadow-none p-0'>
      <CardHeader className='p-0'>
        <AspectRatio ratio={9 / 5} className=''>
          <Skeleton className='h-full' />
        </AspectRatio>
      </CardHeader>

      <div>
        <CardContent className='p-2 flex flex-col gap-2'>
          <Skeleton className='h-5' />
          <Skeleton className='h-5 w-1/2' />
          <Skeleton className='h-5 w-1/3' />
        </CardContent>
        <Separator className='my-1' />
        <CardFooter className='p-2 flex justify-between'>
          <Skeleton className='h-5 w-1/3' />
          <Skeleton className='h-10 w-1/3' />
        </CardFooter>
      </div>
    </Card>
  );
}
