import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Separator } from '@/components/ui/separator';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import ImageSlider from './ImageSlider';

import { BidHistoryType, ItemDataType } from '@/types/types';
import dynamic from 'next/dynamic';

const BiddingAction = dynamic(() => import('./BiddingAction'), { ssr: true });

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getData = async (id: string) => {
  const res = await fetch(`${API_URL}/api/posts/${id}`, { cache: 'no-store' });
  return res.json();
};

const ItemDetails = async ({ params }: { params: { itemId: string } }) => {
  const data: ItemDataType = await getData(params.itemId);

  const imgSlides = data.othersImg;
  imgSlides.unshift(data.displayImg);

  const currentPrice = data.biddingHistory.length
    ? data.biddingHistory[data.biddingHistory.length - 1].price + data.bidIncrement
    : data.initialPrice;
  return (
    <MaxWidthWrapper className='my-10 grid grid-cols-2 gap-2 md:gap-5'>
      <ImageSlider slides={imgSlides} />
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
          <h1 className='mt-5 mb-2 text-2xl font-semibold'>{data.itemName}</h1>
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
                <TableCell className='font-medium'>Post Date: </TableCell>
                <TableCell>{new Date(data.createdAt ?? '').toLocaleString('default', { hour12: true })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>End Date</TableCell>
                <TableCell>{new Date(data.endDate ?? '').toLocaleString('default', { hour12: true })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Remaining Days</TableCell>
                <TableCell>12d : 12h : 12mn</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Start Price</TableCell>
                <TableCell>$ {data.initialPrice.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Bid Increment</TableCell>
                <TableCell>$ {data.bidIncrement.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Current Price</TableCell>
                <TableCell>$ {currentPrice.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className=' col-span-2 md:col-span-1'>
        <BidTable list={data.biddingHistory} />
        <BiddingAction data={data!} />
      </div>
    </MaxWidthWrapper>
  );
};

export default ItemDetails;

const BidTable = ({ list }: { list: BidHistoryType[] }) => {
  return (
    <>
      <h1 className='text-xl font-semibold mt-5 '>Bidding History</h1>

      <div className='max-h-[300px] overflow-y-auto border my-5 rounded-sm'>
        {list.length <= 0 && <h1 className='my-5 ml-5'>No bidder right now.</h1>}
        <Table className=''>
          <TableBody>
            {list.map((item: BidHistoryType, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell className='font-medium'>{item.bidder}</TableCell>
                  <TableCell>$ {item.price.toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.date).toLocaleString('default', { hour12: true })}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
