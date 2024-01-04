'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { auth } from '@/configs/firebase-config';
import { useRouter } from 'next/navigation';
import { ImgType, ItemDataType } from '@/types/types';
import axios from 'axios';
import { init } from 'next/dist/compiled/webpack/webpack';

const Profile = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);

  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        router.push('/');
      }
    });
  });

  return (
    <MaxWidthWrapper className='min-h-screen py-5'>
      <Tabs defaultValue='profile'>
        <TabsList className='flex items-center justify-start w-full flex-wrap'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='myposts'>My Posts</TabsTrigger>
          <TabsTrigger value='userposts'>User Posts</TabsTrigger>
        </TabsList>

        <TabsContent value='profile'>
          <ProfileTab />
        </TabsContent>
        <TabsContent value='myposts'>
          <MyPostsTab />
        </TabsContent>
        <TabsContent value='userposts'>
          <UserPostsTab />
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
};

const ProfileTab = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  return (
    <div className='mt-5 grid grid-cols-2 '>
      <div className='col-span-2 md:col-span-1  mb-10 md:ml-5 py-10 md:py-0 border-b border-b-gray-300 md:border-none'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='min-w-[100px] w-[200px] text-xl'>User Infomation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>First Name</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Last Name</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Email</TableCell>
              <TableCell>{user.userEmail}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Date of birth</TableCell>
              <TableCell>29th - Janaury - 2023</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Phone Number</TableCell>
              <TableCell>016 53 42 41</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Role</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className='mt-5 flex gap-5'>
          <Button variant={'outline'}>Change Infomation</Button>
          <Button variant={'destructive'}>Change Password</Button>
        </div>
      </div>
    </div>
  );
};

const MyPostsTab = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  const [data, setData] = useState<ItemDataType[]>();

  const handleAccept = (inputItem: ItemDataType) => {
    console.log(inputItem);

    const reqData = {
      pending: false,
    };

    axios.patch(`http://localhost:5000/api/posts/${inputItem._id}`, reqData).then(() => {
      setData((prev) => prev?.map((item) => (item._id === inputItem._id ? { ...item, pending: false } : item)));
    });
  };
  const handleRemove = (inputItem: ItemDataType) => {
    console.log(inputItem);

    const reqData = {
      pending: true,
    };

    axios.patch(`http://localhost:5000/api/posts/${inputItem._id}`, reqData).then(() => {
      setData((prev) => prev?.map((item) => (item._id === inputItem._id ? { ...item, pending: true } : item)));
    });
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts/mypost/${user.userID}`).then((res) => setData(res.data));
  }, [user.userID]);

  return (
    <div className='grid grid-cols-12 gap-5 mt-5'>
      <div className=' mt-5 md:mt-0 col-span-12 md:col-span-9 order-2 md:order-1'>
        <h1 className='text-xl font-semibold'>My Recent Posts</h1>
        {data?.map((item) => {
          return (
            <Accordion type='multiple' key={item._id}>
              <AccordionItem value='item-1'>
                <AccordionTrigger className='hover:no-underline'>
                  <div className='flex items-center w-full'>
                    <div className='flex items-center gap-2'>
                      <div className=' w-[100px]'>
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={item.displayImg.downloadURL}
                            alt={item.displayImg.name}
                            sizes='100'
                            fill
                            className='rounded-sm object-cover'
                          />
                        </AspectRatio>
                      </div>
                      <div className='flex flex-col items-start'>
                        <h1 className='text-lg'>{item.itemName}</h1>
                        <h1 className='text-sm font-normal'>{item.seller.name}</h1>
                      </div>
                    </div>
                    <p className='mx-auto hidden md:inline-block'>
                      {new Date(item.createdAt).toLocaleString('default', { hour12: true })}
                    </p>
                    {item.pending ? (
                      <Badge variant='default' className='ml-auto mr-5 bg-red-500'>
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant='default' className='ml-auto mr-5 '>
                        Accepted
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className='grid grid-cols-2 gap-2 lg:gap-5'>
                  <div className='col-span-2 md:col-span-1'>
                    <Carousel className='relative border rounded-md bg-gray-50' opts={{ loop: true }}>
                      <CarouselContent>
                        <CarouselItem>
                          <AspectRatio ratio={16 / 9}>
                            <Image
                              src={item.displayImg.downloadURL}
                              alt={item.displayImg.name}
                              fill
                              sizes='100'
                              className='rounded-sm object-contain'
                            />
                          </AspectRatio>
                        </CarouselItem>
                        {item.othersImg.map((img) => {
                          return (
                            <CarouselItem key={img.name}>
                              <AspectRatio ratio={16 / 9}>
                                <Image
                                  src={img.downloadURL}
                                  alt={img.name}
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
                      </TableBody>
                    </Table>
                  </div>
                  <div className=' col-span-2 md:col-span-1'>
                    <div className='col-span-2 md:col-span-1 row-span-3 mt-5 md:mt-0'>
                      <div className='flex items-center gap-3 mb-2'>
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
                        <h1 className='my-2 text-2xl font-semibold'>Item Name</h1>
                        <p className=' text-muted-foreground'>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque tempora laborum repellendus amet,
                          adipisci inventore, corrupti ipsum fugit suscipit numquam sint, harum repellat quo iure! Deserunt est
                          unde consequuntur velit.
                        </p>
                      </div>

                      <div className='flex mt-10 gap-5'>
                        {item.pending ? (
                          <Button className='' onClick={() => handleAccept(item)}>
                            Accept
                          </Button>
                        ) : (
                          <Button variant={'destructive'} onClick={() => handleRemove(item)}>
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
      <Card className='col-span-12 md:col-span-3 order-1 md:order-2 h-fit shadow-none'>
        <CardHeader>
          <CardTitle>Sumary</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p>Posted Item: 102</p>
          <p>Sold Item: 100</p>
          <p>Current Item: 2</p>
        </CardContent>
      </Card>
    </div>
  );
};

const UserPostsTab = () => {
  const [data, setData] = useState<ItemDataType[]>();
  const [pendingCount, setPendingCount] = useState(0);

  const handleAccept = (inputItem: ItemDataType) => {
    console.log(inputItem);

    const reqData = {
      pending: false,
    };

    axios.patch(`http://localhost:5000/api/posts/${inputItem._id}`, reqData).then(() => {
      setData((prev) => prev?.map((item) => (item._id === inputItem._id ? { ...item, pending: false } : item)));
    });
  };
  const handleRemove = (inputItem: ItemDataType) => {
    console.log(inputItem);

    const reqData = {
      pending: true,
    };

    axios.patch(`http://localhost:5000/api/posts/${inputItem._id}`, reqData).then(() => {
      setData((prev) => prev?.map((item) => (item._id === inputItem._id ? { ...item, pending: true } : item)));
    });
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/posts/pending', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: ItemDataType[]) => {
        setData(data);

        // data.map((item) => (item.pending ? setPendingCount((prev) => prev + ) : setPendingCount((prev) => prev + 0)));
      });
  }, []);
  return (
    <div className='grid grid-cols-12 gap-5 mt-5'>
      <div className=' mt-5 md:mt-0 col-span-12 md:col-span-9 order-2 md:order-1'>
        <h1 className='text-xl font-semibold'>User Pending Posts</h1>
        {data?.map((item) => {
          return (
            <Accordion type='multiple' key={item._id}>
              <AccordionItem value='item-1'>
                <AccordionTrigger className='hover:no-underline'>
                  <div className='flex items-center w-full'>
                    <div className='flex items-center gap-2'>
                      <div className=' w-[100px]'>
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={item.displayImg.downloadURL}
                            alt={item.displayImg.name}
                            sizes='100'
                            fill
                            className='rounded-sm object-cover'
                          />
                        </AspectRatio>
                      </div>
                      <div className='flex flex-col items-start'>
                        <h1 className='text-lg'>{item.itemName}</h1>
                        <h1 className='text-sm font-normal'>{item.seller.name}</h1>
                      </div>
                    </div>
                    <p className='mx-auto hidden md:inline-block'>
                      {new Date(item.createdAt).toLocaleString('default', { hour12: true })}
                    </p>
                    {item.pending ? (
                      <Badge variant='default' className='ml-auto mr-5 bg-red-500'>
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant='default' className='ml-auto mr-5 '>
                        Accepted
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className='grid grid-cols-2 gap-2 lg:gap-5'>
                  <div className='col-span-2 md:col-span-1'>
                    <Carousel className='relative border rounded-md bg-gray-50' opts={{ loop: true }}>
                      <CarouselContent>
                        <CarouselItem>
                          <AspectRatio ratio={16 / 9}>
                            <Image
                              src={item.displayImg.downloadURL}
                              alt={item.displayImg.name}
                              fill
                              sizes='100'
                              className='rounded-sm object-contain'
                            />
                          </AspectRatio>
                        </CarouselItem>
                        {item.othersImg.map((img) => {
                          return (
                            <CarouselItem key={img.name}>
                              <AspectRatio ratio={16 / 9}>
                                <Image
                                  src={img.downloadURL}
                                  alt={img.name}
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
                      </TableBody>
                    </Table>
                  </div>
                  <div className=' col-span-2 md:col-span-1'>
                    <div className='col-span-2 md:col-span-1 row-span-3 mt-5 md:mt-0'>
                      <div className='flex items-center gap-3 mb-2'>
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
                        <h1 className='my-2 text-2xl font-semibold'>Item Name</h1>
                        <p className=' text-muted-foreground'>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque tempora laborum repellendus amet,
                          adipisci inventore, corrupti ipsum fugit suscipit numquam sint, harum repellat quo iure! Deserunt est
                          unde consequuntur velit.
                        </p>
                      </div>

                      <div className='flex mt-10 gap-5'>
                        {item.pending ? (
                          <Button className='' onClick={() => handleAccept(item)}>
                            Accept
                          </Button>
                        ) : (
                          <Button variant={'destructive'} onClick={() => handleRemove(item)}>
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
      <Card className='col-span-12 md:col-span-3 order-1 md:order-2 h-fit shadow-none'>
        <CardHeader>
          <CardTitle>Sumary</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p>All Items: {data?.length}</p>
          <p>Pending Items: {pendingCount}</p>
          <p>Accepted Items: 2</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
