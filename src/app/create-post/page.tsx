'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { AspectRatio } from '../../components//ui/aspect-ratio';
import { Button } from '../../components//ui/button';
import { Card, CardContent } from '../../components/ui/card';

import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import EventEmitter from 'events';

const CreatePost = () => {
  const [category, setCategory] = useState('');

  const [displayImage, setDisplayImage] = useState<any | null>(null);
  const [loadingDisplayImage, setLoadingDisplayImage] = useState<boolean>(false);

  const [othersImage, setOthersImage] = useState<string[]>([]);
  const [loadingOthersImage, setLoadingOthersImage] = useState<boolean>(false);

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

    console.log({ ...values, category, location, displayImage, othersImage });
  }

  const handleUploadDisplayImg = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const inputData = e.target.files![0];

    console.log(inputData);

    const formData = new FormData();
    formData.append('filename', inputData);

    setLoadingDisplayImage(true);

    axios
      .post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setDisplayImage(res.data);
        setLoadingDisplayImage(false);
        console.log(res.data);
      });
  };

  const handleUploadOtherImg = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const inputData = Array.from(e.target.files!);

    inputData.map((img) => {
      console.log(img);
      const formData = new FormData();

      formData.append('filename', img);
      setLoadingOthersImage(true);

      axios
        .post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          setOthersImage((prev) => prev.concat(res.data));
          setLoadingOthersImage(false);
        });
    });
  };

  const handleDelete = async (inputData: any) => {
    axios
      .delete(`http://localhost:5000/upload/${inputData.storageFileName}`)
      .then(() => setDisplayImage(null))
      .catch((err) => console.log(err));
  };
  const handleDeleteOthers = async (inputData: any) => {
    axios
      .delete(`http://localhost:5000/upload/${inputData.storageFileName}`)
      .then(() => {
        setOthersImage((prev) => prev.filter((item) => item.storageFileName != inputData.storageFileName));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
    }

    if (displayImage) {
      window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
    };
  });

  return (
    <MaxWidthWrapper>
      <div className='max-w-[600px] mx-auto my-10'>
        <h1 className='text-3xl font-semibold text-center mb-10'>Create Post</h1>

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
                  {displayImage || loadingDisplayImage ? null : (
                    <Button asChild variant={'secondary'}>
                      <Input type='file' onChange={(e) => handleUploadDisplayImg(e)} />
                    </Button>
                  )}

                  {!displayImage && loadingDisplayImage ? (
                    <Card className=' shadow-none rounded-md'>
                      <CardContent className='p-2'>
                        <div className='flex items-center justify-between'>
                          <Skeleton className='w-[150px] h-[100px] rounded-md' />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    ''
                  )}

                  {!displayImage ? null : (
                    <Card className=' shadow-none rounded-md'>
                      <CardContent className='p-2'>
                        <div className='flex items-center justify-between'>
                          <div className='w-[150px] h-[100px] bg-gray-100 rounded-md flex items-center justify-center'>
                            <AspectRatio ratio={16 / 9}>
                              <Image
                                priority
                                sizes='100'
                                src={displayImage.downloadURL}
                                alt='hi'
                                className='object-contain'
                                fill
                              />
                            </AspectRatio>
                          </div>
                          <Button type='button' variant={'outline'} className='mr-5' onClick={() => handleDelete(displayImage)}>
                            <Trash2 className='text-red-500 w-5 h-5' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>Other Pictures</Label>
                  <Button asChild variant={'secondary'}>
                    <Input type='file' multiple onChange={(e) => handleUploadOtherImg(e)} />
                  </Button>
                  {!othersImage && loadingOthersImage ? (
                    <Card className=' shadow-none rounded-md'>
                      <CardContent className='p-2'>
                        <div className='flex items-center justify-between'>
                          <Skeleton className='w-[150px] h-[100px] rounded-md' />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    ''
                  )}

                  {!othersImage ? null : (
                    <>
                      {othersImage?.map((img) => {
                        return (
                          <Card key={img.name} className=' shadow-none rounded-md'>
                            <CardContent className='p-2'>
                              <div className='flex items-center justify-between'>
                                <div className='w-[150px] h-[100px] bg-gray-100 rounded-md flex items-center justify-center'>
                                  <AspectRatio ratio={16 / 9}>
                                    <Image priority sizes='100' src={img.downloadURL} alt='hi' className='object-contain' fill />
                                  </AspectRatio>
                                </div>
                                <Button
                                  type='button'
                                  variant={'outline'}
                                  className='mr-5'
                                  onClick={() => handleDeleteOthers(img)}
                                >
                                  <Trash2 className='text-red-500 w-5 h-5' />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
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
              <div className='flex justify-center'>
                <Button type='submit'>Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CreatePost;
