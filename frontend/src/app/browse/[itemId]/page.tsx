import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Separator } from '@/components/ui/separator';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import ImageSlider from './ImageSlider';
import BiddingHistory from './BiddingHistory';

import { ImgType, ItemDataType, sliderArray } from '@/types/types';

const getItems = async (id: string) => {
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, { cache: 'no-store' });
  const data = await res.json();
  return data;
};

const ItemDetails = async ({ params }: { params: { itemId: string } }) => {
  const data: ItemDataType = await getItems(params.itemId);

  const slides: ImgType[] = data.othersImg;
  slides.unshift(data.displayImg);

  return (
    <MaxWidthWrapper className='my-10 grid grid-cols-2 gap-2 md:gap-5'>
      <ImageSlider slides={slides} />
      <div className='col-span-2 md:col-span-1 row-span-3 mt-5 md:mt-0'>
        <div className='flex items-center gap-3 mb-5'>
          <Avatar>
            <AvatarImage src={data.seller.pfImgURL} className=' object-cover' />
            <AvatarFallback>PF</AvatarFallback>
          </Avatar>

          <div>
            <h3 className='text-lg font-semibold'>{data.seller.name}</h3>
            <h6 className='text-sm'>Seller</h6>
          </div>
        </div>
        <Separator />

        <div>
          <h1 className='my-5 text-2xl font-semibold'>{data.itemName}</h1>
          <p className=' text-muted-foreground'>{data.itemDescription}</p>

          <Table className='mt-5'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[30%] text-lg'>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium'>Category</TableCell>
                <TableCell>{data.category}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Location</TableCell>
                <TableCell>{`${data.location.district}, ${data.location.city}, ${data.location.country}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Post Date: </TableCell>
                <TableCell>{new Date(data.createdAt).toLocaleString('default', { hour12: true })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>End Date</TableCell>
                <TableCell>{new Date(data.endDate).toLocaleString('default', { hour12: true })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Remaining Days</TableCell>
                <TableCell>12d : 12h : 12mn</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Start Price</TableCell>
                <TableCell>$ {data.initialPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Bid Increment</TableCell>
                <TableCell>$ {data.initialPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Current Price</TableCell>
                <TableCell>$ 2,302</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className=' col-span-2 md:col-span-1'>
        <BiddingHistory data={data} />
      </div>
    </MaxWidthWrapper>
  );
};

export default ItemDetails;
