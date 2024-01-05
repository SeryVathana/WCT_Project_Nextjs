'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

import { ImgType } from '@/types/types';
import { Badge } from '@/components/ui/badge';

const ImageSlider = ({ slides }: { slides: ImgType[] }) => {
  return (
    <Carousel className='relative col-span-2 md:col-span-1 bg-gray-50 rounded-lg' opts={{ loop: true }}>
      <CarouselContent>
        {slides?.map((slide: ImgType, index: number) => {
          return (
            <CarouselItem key={index}>
              <Badge variant='secondary' className='absolute z-10 w-auto whitespace-nowrap mt-5 ml-5'>
                {index + 1} / {slides?.length}
              </Badge>
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={slide.downloadURL}
                  priority
                  alt='image slider'
                  fill
                  sizes='100'
                  className='rounded-sm object-contain'
                />
              </AspectRatio>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className='absolute top-1/2 left-7 -translate-x-1/2' />
      <CarouselNext className='absolute top-1/2 right-0 -translate-x-1/2' />
    </Carousel>
  );
};

export default ImageSlider;
