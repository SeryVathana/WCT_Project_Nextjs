'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ItemDataType, BidHistoryType } from '@/types/types';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import axios from 'axios';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Item } from '@radix-ui/react-dropdown-menu';

import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/configs/firebase-config';
import { useRouter } from 'next/navigation';

const BiddingHistory = ({
  data,
  bidHistory,
  setBidHistory,
  setCurrentPrice,
}: {
  data: ItemDataType;
  bidHistory: BidHistoryType[];
  setBidHistory: Dispatch<SetStateAction<BidHistoryType[]>>;
  setCurrentPrice: Dispatch<SetStateAction<number>>;
}) => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  const { toast } = useToast();
  const router = useRouter();
  // const [bidHistory, setBidHistory] = useState<BidHistoryType[]>(data?.biddingHistory);

  const formSchema = z.object({
    bidPrice: z.coerce.number().min(data?.bidIncrement, {
      message: 'Value must be equal or higher than bid increment.',
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bidPrice: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!auth.currentUser) {
      router.push('/sign-in');
      return;
    }

    const newUpdate = await axios.get(`http://localhost:5000/api/posts/${data?._id}`);
    const newUpdateData: ItemDataType = await newUpdate.data;

    if (newUpdateData?.pending) {
      console.log('is Pending');
      return;
    }

    if (newUpdateData.biddingHistory[newUpdateData.biddingHistory.length - 1].bidderId === user.userID) {
      console.log(user.userID);

      toast({
        variant: 'destructive',
        title: 'Your are the last bidder.',
        description: "You can't bid right now!",
      });
      return;
    }

    const reqBody: BidHistoryType = {
      bidderId: user.userID,
      bidder: user.username,
      price: values.bidPrice,
      date: new Date(Date.now()).toISOString(),
    };
    console.log(reqBody);

    await axios.patch(`http://localhost:5000/api/posts/${data?._id}`, { biddingHistory: reqBody }).then(() => {
      setBidHistory((prev) => [...prev, reqBody]);
      setCurrentPrice((prev) => prev + values.bidPrice);
    });
  };

  return (
    <div>
      <BidTable list={bidHistory} />

      {user.userID == data?.seller.id ? null : (
        <Form {...form}>
          <form className='flex w-full max-w-sm items-center mt-5 gap-3' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='bidPrice'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Place your bid</FormLabel>
                  <FormControl>
                    <div className='flex gap-3'>
                      <div className='relative'>
                        <Input type='number' placeholder='Enter bid price' className='h-[50px] text-md pl-8' {...field} />
                        <span className='absolute -translate-y-1/2 top-1/2 left-3.5 text-muted-foreground'>$</span>
                      </div>
                      <Button type='submit' size={'lg'} className='h-[50px]'>
                        Place bid
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </div>
  );
};

const BidTable = ({ list }: { list: BidHistoryType[] }) => {
  return (
    <>
      <h1 className='text-xl font-semibold mt-5 '>Bidding History</h1>

      <div className='max-h-[300px] overflow-y-auto border my-5 rounded-sm'>
        {list.length <= 0 && <h1 className='my-5 ml-5'>No bidder right now.</h1>}
        <Table className=''>
          <TableBody>
            {list?.map((item: BidHistoryType, index) => {
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
        <Toaster />
      </div>
    </>
  );
};

export default BiddingHistory;
