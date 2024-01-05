'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Separator } from '@/components/ui/separator';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import ImageSlider from './ImageSlider';

import { BidHistoryType, ImgType, ItemDataType, sliderArray } from '@/types/types';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BiddingHistory = dynamic(() => import('./BiddingHistory'), { ssr: false });
const API_URL = 'https://auction-site-server.onrender.com';

const ItemDetails = ({ params }: { params: { itemId: string } }) => {
  const [data, setData] = useState<ItemDataType>();
  const [biddingHistory, setBiddingHistory] = useState<BidHistoryType[]>([]);
  const [slides, setSlides] = useState<ImgType[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    axios.get(`${API_URL}/api/posts/${params.itemId}`).then((res) => {
      setData(res.data);
      setBiddingHistory(res.data.biddingHistory);
      setSlides([res.data.displayImg, ...res.data?.othersImg]);
      // setCurrentPrice(res.data.biddingHistory.map(() =))
      const total = res.data.biddingHistory.reduce((sum: number, item: BidHistoryType) => sum + item.price, 0);
      setCurrentPrice(total + res.data.initialPrice);
    });
  }, []);

  return (
    <MaxWidthWrapper className='my-10 grid grid-cols-2 gap-2 md:gap-5'>
      <ImageSlider slides={slides} />
      <div className='col-span-2 md:col-span-1 row-span-3 mt-5 md:mt-0'>
        <div className='flex items-center gap-3 mb-5'>
          <Avatar>
            <AvatarImage src={data?.seller.pfImgURL} className=' object-cover' />
            <AvatarFallback>PF</AvatarFallback>
          </Avatar>

          <div>
            <h3 className='text-lg font-semibold'>{data?.seller.name}</h3>
            <h6 className='text-sm'>Seller</h6>
          </div>
        </div>
        <Separator />

        <div>
          <h1 className='my-5 text-2xl font-semibold'>{data?.itemName}</h1>
          <p className=' text-muted-foreground'>{data?.itemDescription}</p>

          <Table className='mt-5'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[30%] text-lg'>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium'>Category</TableCell>
                <TableCell>{data?.category}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Location</TableCell>
                <TableCell>{`${data?.location.district}, ${data?.location.city}, ${data?.location.country}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Post Date: </TableCell>
                <TableCell>{new Date(data?.createdAt ?? '').toLocaleString('default', { hour12: true })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>End Date</TableCell>
                <TableCell>{new Date(data?.endDate ?? '').toLocaleString('default', { hour12: true })}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Remaining Days</TableCell>
                <TableCell>12d : 12h : 12mn</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Start Price</TableCell>
                <TableCell>$ {data?.initialPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Bid Increment</TableCell>
                <TableCell>$ {data?.bidIncrement}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Current Price</TableCell>
                <TableCell>$ {currentPrice?.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className=' col-span-2 md:col-span-1'>
        <BiddingHistory
          data={data!}
          bidHistory={biddingHistory}
          setBidHistory={setBiddingHistory}
          setCurrentPrice={setCurrentPrice}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default ItemDetails;
