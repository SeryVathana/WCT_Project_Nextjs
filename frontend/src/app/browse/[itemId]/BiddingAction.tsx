'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

import { BidHistoryType, ItemDataType } from '@/types/types';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RootState } from '@/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { sendEmail } from '@/app/sendEmail';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/configs/firebase-config';

import { useRouter } from 'next/navigation';
import { z } from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BiddingAction = ({ data }: { data: ItemDataType }) => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  const { toast } = useToast();
  const router = useRouter();

  const bidLowestPrice = data.biddingHistory.length
    ? data.biddingHistory[data.biddingHistory.length - 1].price + data.bidIncrement
    : data.initialPrice + data.bidIncrement;
  const [bidPrice, setBidPrice] = useState<number>(bidLowestPrice);

  const formSchema = z.object({
    bidPrice: z.coerce.number().min(bidLowestPrice, {
      message: `Value must be equal or higher than $${bidLowestPrice}.`,
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bidPrice: bidPrice,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!auth.currentUser) {
      router.push('/sign-in');
      return;
    }

    if (!user.isAuth) {
      router.push('/sign-in');
      return;
    }

    if (user.username == 'Guest') {
      router.push('/sign-in');
      return;
    }

    if (bidPrice < bidLowestPrice) {
      return;
    }

    console.log(bidPrice);

    const newUpdate = await axios.get(`${API_URL}/api/posts/${data?._id}`);
    const newUpdateData: ItemDataType = await newUpdate.data;

    if (newUpdateData?.pending) {
      console.log('is Pending');
      return;
    }

    if (
      newUpdateData.biddingHistory.length != 0 &&
      newUpdateData.biddingHistory[newUpdateData.biddingHistory.length - 1].bidderId === user.userID
    ) {
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

    await axios.patch(`${API_URL}/api/posts/${data?._id}`, { biddingHistory: reqBody }).then(async () => {
      if (newUpdateData.biddingHistory.length != 0) {
        await axios
          .get(`${API_URL}/user/${newUpdateData.biddingHistory[newUpdateData.biddingHistory.length - 1].bidderId}`)
          .then((res: any) => {
            const lastBidAmount = newUpdateData.biddingHistory[newUpdateData.biddingHistory.length - 1].price;
            const lastBidder = res.data[0];
            console.log(lastBidder);

            sendEmail(
              lastBidder.email,
              'Someone bid over you.',
              lastBidder.displayName,
              data.itemName,
              lastBidAmount,
              `https://auction-site-wct.vercel.app/browse/${data._id}`
            ).catch((err) => {
              console.log(err);
            });
          });
      }
      toast({
        title: 'You just placed a bid.',
        description: 'Good Luck!',
      });
    });
    setBidPrice((prev) => prev + data.bidIncrement);
    router.refresh();
  };

  return (
    <div>
      <Toaster />

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

export default BiddingAction;
