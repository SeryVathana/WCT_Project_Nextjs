'use client';
import React, { useState } from 'react';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

interface SliderProps {
  url: string;
}

type sliderArray = SliderProps[];

const ItemDetails = ({ params }: { params: { itemId: string } }) => {
  const slides: sliderArray = [
    {
      url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
    },

    {
      url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    },
  ];

  return (
    <MaxWidthWrapper className='my-10 grid grid-cols-2 gap-2 md:gap-5'>
      <ImageSlider slides={slides} />
      <div className='col-span-2 md:col-span-1 row-span-3 mt-5 md:mt-0'>
        <div className='flex items-center gap-3 mb-5'>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <h3 className='text-lg font-semibold'>Sery Vathana</h3>
            <h6 className='text-sm'>Seller</h6>
          </div>
        </div>
        <Separator />

        <div>
          <h1 className='my-5 text-2xl font-semibold'>Item Name</h1>
          <p className=' text-muted-foreground'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque tempora laborum repellendus amet, adipisci inventore,
            corrupti ipsum fugit suscipit numquam sint, harum repellat quo iure! Deserunt est unde consequuntur velit.
          </p>

          <Table className='mt-5'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[30%] text-lg'>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium'>Categories</TableCell>
                <TableCell>Electronic, Devices</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Location</TableCell>
                <TableCell>Siem Reap, Cambodia</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Start Date: </TableCell>
                <TableCell>12 - Nov - 2023</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>End Date</TableCell>
                <TableCell>12 - Nov - 2023</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Remaining Days</TableCell>
                <TableCell>12d : 12h : 12mn</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Start Price</TableCell>
                <TableCell>$ 1,219</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Bid Increment</TableCell>
                <TableCell>$ 100</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Current Price</TableCell>
                <TableCell>$ 2,302</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className='flex w-full max-w-sm items-center space-x-2 mt-5'>
            <Input type='number' placeholder='Enter bid price' />
            <Button type='submit' size={'lg'}>
              Place bid
            </Button>
          </div>
        </div>
      </div>

      <div className=' col-span-2 md:col-span-1'>
        <Table className='mt-5'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[30%] text-xl'>Bidding History</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>Sery Vathana</TableCell>
              <TableCell className='w-[30%]'>$ 1,023</TableCell>
              <TableCell>23 - Nov - 2023 : 12:23pm</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </MaxWidthWrapper>
  );
};

const ImageSlider: React.FC<{ slides: sliderArray }> = ({ slides }) => {
  return (
    <Carousel className='relative col-span-2 md:col-span-1' opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <AspectRatio ratio={16 / 9}>
              <Image src={slide.url} alt='hi' fill className='rounded-sm' />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='absolute top-1/2 left-7 -translate-x-1/2' />
      <CarouselNext className='absolute top-1/2 right-0 -translate-x-1/2' />
    </Carousel>
  );
};

export default ItemDetails;
