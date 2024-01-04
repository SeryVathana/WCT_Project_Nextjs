'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState } from 'react';

import { ItemDataType, BidHistoryType } from '@/types/types';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const BiddingHistory = ({ data }: { data: ItemDataType }) => {
  const formSchema = z.object({
    bidPrice: z.coerce.number().min(data.bidIncrement, {
      message: 'Value must be equal or higher than bid increment.',
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bidPrice: data.bidIncrement,
    },
  });

  const [bidValue, setBidValue] = useState<number>(data.bidIncrement);
  const [bidHistory, setBidHistory] = useState<BidHistoryType[]>(data.biddingHistory);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <BidTable list={bidHistory} />

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
                      <Input
                        type='number'
                        placeholder='Enter bid price'
                        // value={bidValue}
                        // onChange={(e) => setBidValue(Number(e.target.value))}
                        className='h-[50px] text-md pl-8'
                        {...field}
                      />
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
    </div>
  );
};

const BidTable = ({ list }: { list: BidHistoryType[] }) => {
  return (
    <>
      <h1 className='text-xl font-semibold mt-5 '>Bidding History</h1>

      <div className='max-h-[300px] overflow-y-auto border my-5 rounded-sm'>
        <Table className=''>
          <TableBody>
            {list?.map((item: BidHistoryType, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell className='font-medium'>Sery Vathana</TableCell>
                  <TableCell>$ 1,023</TableCell>
                  <TableCell>{item.date.toString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default BiddingHistory;
