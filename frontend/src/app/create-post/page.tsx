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

import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/configs/firebase-config';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import { Toaster } from '@/components/ui/toaster';
import { PRODUCT_CATEGORIES } from '@/data/List';

type ImageResType = {
  storageFileName: string;
  downloadURL: string;
  message: string;
  name: string;
  type: string;
};

const CreatePost = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  const router = useRouter();
  const { toast } = useToast();

  const [category, setCategory] = useState('');
  const [errorCategory, setErrorCategory] = useState<boolean>(false);

  const [displayImage, setDisplayImage] = useState('');
  const [displayFileImage, setDisplayFileImage] = useState<File | string>('');
  const [errorDisplayImage, setErrorDisplayImage] = useState<boolean>(false);

  const [othersImage, setOthersImage] = useState<string[]>([]);
  const [othersFileImage, setOthersFileImage] = useState<File[]>([]);
  const [errorOthersImage, setErrorOthersImage] = useState<boolean>(false);

  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [errorDate, setErrorDate] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const resetInput = () => {
    setUploading(false);
    setCategory('');
    setErrorCategory(false);
    setDisplayImage('');
    setDisplayFileImage('');
    setErrorDisplayImage(false);
    setOthersImage([]);
    setOthersFileImage([]);
    setErrorOthersImage(false);
    setEndDate('');
    setEndTime('');
    setErrorDate(false);
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        router.push('/sign-in');
      }
    });
  }, [router]);

  const formSchema = z.object({
    itemName: z.string({ required_error: 'Please enter item name' }).min(2, 'Input must be atleast 2 characters.').max(50),
    itemDescription: z
      .string({ required_error: 'Please enter item description' })
      .min(2, 'Input must be atleast 2 characters.')
      .max(250),
    location: z.object({
      district: z.string({ required_error: 'Please enter bidding district' }).min(2).max(50),
      city: z.string({ required_error: 'Please enter bidding city' }).min(2).max(50),
      country: z.string({ required_error: 'Please enter bidding country' }).min(2).max(50),
    }),
    initialPrice: z.coerce.number({ required_error: 'Please enter start price' }).int().min(1),
    bidIncrement: z.coerce
      .number({ required_error: 'Please enter bidding increment' })
      .int({ message: 'Number must be integer' })
      .min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: '',
      itemDescription: '',
      location: {
        district: '',
        city: '',
        country: '',
      },
      initialPrice: Number(''),
      bidIncrement: Number(''),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!displayImage) {
      setErrorDisplayImage(true);
      return;
    } else {
      setErrorDisplayImage(false);
    }

    if (othersImage.length <= 0) {
      setErrorOthersImage(true);
      return;
    } else {
      setErrorOthersImage(false);
    }

    if (!endDate || !endTime) {
      setErrorDate(true);
      return;
    } else {
      setErrorDate(false);
    }

    if (!category) {
      setErrorCategory(true);
      return;
    } else {
      setErrorCategory(false);
    }

    setUploading(true);

    let displayImageObj;
    let othersImageObj: ImageResType[] = [];

    await axios
      .post(
        'http://localhost:5000/upload',
        { filename: displayFileImage },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        displayImageObj = res.data;
      });

    let otherImgData = new FormData();
    othersFileImage.map((file) => {
      otherImgData.append('filename', file);
    });

    await axios.post('http://localhost:5000/upload/multiple', otherImgData).then((res) => {
      othersImageObj = res.data;
    });

    console.log(displayImageObj);
    console.log(othersImageObj);

    const endDateTime = new Date(endDate + ' ' + endTime).toISOString();
    const data = {
      ...values,
      displayImg: displayImageObj,
      othersImg: othersImageObj,
      endDate: endDateTime,
      biddingHistory: [],
      category,
      pending: true,
      seller: {
        id: user.userID,
        name: user.username,
        email: user.userEmail,
        pfImgURL: user.userPfURL,
      },
    };

    axios
      .post('http://localhost:5000/api/posts', data)
      .then((res) => {
        console.log(res);
        toast({
          title: 'Post Submited',
          description: 'Your post need to be reviewed by admin before go to public.',
        });
        resetInput();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUploadDisplayImg = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const inputData = e.target.files![0];
    const Url = URL.createObjectURL(inputData);
    console.log(Url);
    setDisplayImage(Url);
    setDisplayFileImage(inputData);
  };

  const handleUploadOtherImg = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const inputData = Array.from(e.target.files!);
    setOthersFileImage(inputData);

    inputData.map((img) => {
      const Url = URL.createObjectURL(img);
      setOthersImage((prev) => [...prev, Url]);
    });
  };

  const handleDelete = async (inputData: any) => {
    setDisplayImage('');

    setDisplayFileImage('');
  };
  const handleDeleteOthers = async (inputData: any) => {
    const index = othersImage.findIndex((item) => item === inputData);
    setOthersImage((prev) => prev.filter((item) => item != inputData));
    // setOthersFileImage((prev) => prev.splice(index));
    const data = othersFileImage;
    console.log(data);
    data.splice(index, 1);
    console.log(data);
    setOthersFileImage(data);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
              <div className=' space-y-12'>
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
                  <Label htmlFor='category' className={errorDisplayImage ? 'text-destructive' : ''}>
                    Display Picture
                  </Label>
                  {displayImage ? null : (
                    <>
                      <Button asChild variant={'secondary'}>
                        <Input type='file' onChange={(e) => handleUploadDisplayImg(e)} />
                      </Button>
                      {errorDisplayImage && <p className='text-sm font-medium text-destructive'>Display Image is required</p>}
                    </>
                  )}

                  {!displayImage ? null : (
                    <Card className=' shadow-none rounded-md'>
                      <CardContent className='p-2'>
                        <div className='flex items-center justify-between'>
                          <div className={`w-[150px] bg-gray-50 rounded-md flex items-center justify-center`}>
                            <AspectRatio ratio={16 / 9}>
                              <Image priority sizes='100' src={displayImage} alt='hi' className='object-contain' fill />
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
                  <Label htmlFor='category' className={errorOthersImage ? 'text-destructive' : ''}>
                    Other Pictures
                  </Label>
                  <Button asChild variant={'secondary'}>
                    <Input type='file' multiple onChange={(e) => handleUploadOtherImg(e)} />
                  </Button>
                  {errorOthersImage && <p className='text-sm font-medium text-destructive'>Other Images is required</p>}
                  {!othersImage ? (
                    <Card className=' shadow-none rounded-md'>
                      <CardContent className='p-2'>
                        <div className='flex items-center justify-between'>
                          <Skeleton className='w-[150px]  h-[84.375px] rounded-md' />
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
                          <Card key={img} className=' shadow-none rounded-md'>
                            <CardContent className='p-2'>
                              <div className='flex items-center justify-between '>
                                <div className='w-[150px] bg-gray-50 rounded-md flex items-center justify-center'>
                                  <AspectRatio ratio={16 / 9}>
                                    <Image priority sizes='100' src={img} alt='hi' className='object-contain' fill />
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
                  <Label htmlFor='category' className={errorDisplayImage ? 'text-destructive' : ''}>
                    Item Category
                  </Label>
                  <Select onValueChange={(e) => setCategory(e)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Pick a category' />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.slice(1, PRODUCT_CATEGORIES.length).map((cate) => {
                        return (
                          <SelectItem key={cate} value={cate.toLowerCase()}>
                            {cate}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errorCategory && <p className='text-sm font-medium text-destructive'>Category is required</p>}
                </div>
                <div className='space-y-2'>
                  <h1 className='text-md font-semibold'>Location</h1>
                  <div className='flex gap-2'>
                    <FormField
                      control={form.control}
                      name='location.district'
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
                      name='location.city'
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
                      name='location.country'
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
                  name='initialPrice'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Start Price</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input placeholder='Start price' type='number' {...field} className='pl-8 ' />
                          <span className='absolute -translate-y-1/2 top-1/2 left-3 text-muted-foreground'>$</span>
                        </div>
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
                        <div className='relative'>
                          <Input placeholder='Bid Increment' type='number' {...field} className='pl-8 ' />
                          <span className='absolute -translate-y-1/2 top-1/2 left-3 text-muted-foreground'>$</span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className='space-y-2'>
                  <Label>End Date and Time</Label>
                  <div className='grid grid-cols-5 gap-2'>
                    <Input
                      placeholder='End Date'
                      type='date'
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                      }}
                      className='col-span-3'
                    />
                    <Input
                      placeholder='End Date'
                      type='time'
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                      }}
                      className='col-span-2'
                    />
                  </div>
                  {errorDate && <p className='text-sm font-medium text-destructive'>End Date and Time is required</p>}
                </div>
              </div>
              <Toaster />
              <div className='flex justify-center'>
                <Button type='submit' disabled={uploading}>
                  {uploading ? 'Loading' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CreatePost;
