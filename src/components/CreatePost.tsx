import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AspectRatio } from './ui/aspect-ratio';
import Image from 'next/image';

const CreatePost = () => {
  const [category, setCategory] = useState('');

  const formSchema = z.object({
    itemName: z.string({ required_error: 'Please enter item name' }).min(2).max(50),
    itemDescription: z.string({ required_error: 'Please enter item description' }).min(2).max(120),
    district: z.string({ required_error: 'Please enter bidding district' }).min(2).max(50),
    city: z.string({ required_error: 'Please enter bidding city' }).min(2).max(50),
    country: z.string({ required_error: 'Please enter bidding country' }).min(2).max(50),
    startPrice: z.string({ required_error: 'Please enter start price' }),
    bidIncrement: z.string({ required_error: 'Please enter bidding increment' }),
    endDate: z.string({ required_error: 'Please enter bidding end date' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: '',
      itemDescription: '',
      district: '',
      city: '',
      country: '',
      startPrice: '',
      bidIncrement: '',
      endDate: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const location = {
      district: values.district,
      city: values.city,
      country: values.country,
    };

    console.log({ ...values, category, location });
  }
  return (
    <>
      <h1 className='text-xl font-semibold'>Create Post</h1>

      <div className='mt-5'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className=' space-y-5'>
              <FormField
                control={form.control}
                name='itemName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Item name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='itemDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter your description here.' {...field} />
                    </FormControl>
                    <FormDescription>Maximum 120 words.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-2'>
                <Label htmlFor='category'>Display Picture</Label>
                <Button asChild variant={'secondary'}>
                  <Input type='file' />
                </Button>
                <Card className=' shadow-none rounded-md'>
                  <CardContent className='p-2'>
                    <div className='flex items-center justify-between'>
                      <div className='w-[150px]'>
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={
                              'https://images.unsplash.com/photo-1703209935163-8c7fa7b685f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8'
                            }
                            alt='hi'
                            className='rounded-sm'
                            fill
                          ></Image>
                        </AspectRatio>
                      </div>
                      <Button variant={'outline'} className='mr-5'>
                        <Trash2 className='text-red-500 w-5 h-5' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Other Pictures</Label>
                <Button asChild variant={'secondary'}>
                  <Input type='file' multiple />
                </Button>
                <Card className=' shadow-none rounded-md'>
                  <CardContent className='p-2 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='w-[150px]'>
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={
                              'https://images.unsplash.com/photo-1703209935163-8c7fa7b685f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8'
                            }
                            alt='hi'
                            className='rounded-sm'
                            fill
                          ></Image>
                        </AspectRatio>
                      </div>
                      <Button variant={'outline'} className='mr-5'>
                        <Trash2 className='text-red-500 w-5 h-5' />
                      </Button>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='w-[150px]'>
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={
                              'https://images.unsplash.com/photo-1703209935163-8c7fa7b685f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8'
                            }
                            alt='hi'
                            className='rounded-sm'
                            fill
                          ></Image>
                        </AspectRatio>
                      </div>
                      <Button variant={'outline'} className='mr-5'>
                        <Trash2 className='text-red-500 w-5 h-5' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Item Category</Label>
                <Select onValueChange={(e) => setCategory(e)} required>
                  <SelectTrigger>
                    <SelectValue placeholder='Pick a category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <h1 className='text-md font-semibold'>Location</h1>
                <div className='flex gap-2'>
                  <FormField
                    control={form.control}
                    name='district'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input placeholder='District' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='city'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder='City' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder='Country' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name='startPrice'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Start Price</FormLabel>
                    <FormControl>
                      <Input placeholder='Start price' type='number' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bidIncrement'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Bid Increment</FormLabel>
                    <FormControl>
                      <Input placeholder='Bid Increment' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input placeholder='End Date' type='date' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreatePost;
