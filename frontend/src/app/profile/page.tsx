'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '@/configs/firebase-config';
import { RootState } from '@/redux/store';
import { ItemDataType } from '@/types/types';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Item } from 'firebase/analytics';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRODUCT_CATEGORIES } from '@/data/List';

const Profile = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);

  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        router.push('/sign-in');
      }
    });
  }, []);

  return (
    <MaxWidthWrapper className='min-h-screen py-5'>
      <Tabs defaultValue='profile'>
        <TabsList className='flex items-center justify-start w-full flex-wrap'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='myposts'>My Posts</TabsTrigger>
          {user.isModerator ? <TabsTrigger value='userposts'>User Posts</TabsTrigger> : null}
        </TabsList>

        <TabsContent value='profile'>
          <ProfileTab />
        </TabsContent>
        <TabsContent value='myposts'>
          <MyPostsTab />
        </TabsContent>
        {user.isModerator ? (
          <TabsContent value='userposts'>
            <UserPostsTab />
          </TabsContent>
        ) : null}
      </Tabs>
    </MaxWidthWrapper>
  );
};

type UserInfoType = {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
  photoURL: string;
  birthDate: string;
  displayName: string;
  isModerator: boolean;
};

const ProfileTab = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  const [userInfo, setUserInfo] = useState<UserInfoType>();

  useEffect(() => {
    if (auth.currentUser) {
      axios.get(`http://localhost:5000/user/${user.userID}`).then((res) => {
        setUserInfo(res.data[0]);
      });
    }
  }, [user]);

  const giveDateTime = (inputDate: string | undefined) => {
    if (!inputDate) {
      return;
    }

    const today = new Date(inputDate);
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    return date;
  };

  return (
    <div className='mt-5 grid grid-cols-2'>
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
              <TableCell>{userInfo?.firstName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Last Name</TableCell>
              <TableCell>{userInfo?.lastName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Email</TableCell>
              <TableCell>{userInfo?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Date of birth</TableCell>
              <TableCell>{giveDateTime(userInfo?.birthDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Role</TableCell>
              <TableCell>{userInfo?.isModerator ? 'Admin' : 'User'}</TableCell>
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
  const [data, setData] = useState<ItemDataType[]>([]);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (auth.currentUser) {
      axios.get(`http://localhost:5000/api/posts/mypost/${user.userID}`).then((res) => setData(res.data));
    }
  }, [user.userID]);

  return (
    <div className='grid grid-cols-12 gap-5 mt-5'>
      <Card className=' mt-5 md:mt-0 col-span-12 md:col-span-9 order-2 md:order-1 p-2 shadow-none'>
        <h1 className='text-xl font-semibold'>My Recent Posts</h1>

        {data?.length <= 0 && <h1 className='mt-5 text-center'>No item found.</h1>}

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
                          <TableCell>{item.category}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Location</TableCell>
                          <TableCell>
                            {item.location.district + ', ' + item.location.city + ', ' + item.location.country}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Start Date: </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleString('default', { hour12: true })}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>End Date</TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleString('default', { hour12: true })}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Start Price</TableCell>
                          <TableCell>$ {item.initialPrice.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Bid Increment</TableCell>
                          <TableCell>$ {item.bidIncrement.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className=' col-span-2 md:col-span-1'>
                    <div className='col-span-2 md:col-span-1 row-span-3 mt-5 md:mt-0'>
                      <div className='flex items-center gap-3 mb-2'>
                        <Avatar>
                          <AvatarImage src={item.seller.pfImgURL} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div>
                          <h3 className='text-lg font-semibold'>{item.seller.name}</h3>
                          <h6 className='text-sm text-muted-foreground'>{item.seller.email}</h6>
                        </div>
                      </div>
                      <Separator />

                      <div>
                        <h1 className='my-2 text-2xl font-semibold'>{item.itemName}</h1>
                        <p className=' text-muted-foreground'>{item.itemDescription}</p>
                      </div>
                    </div>
                    {!item.pending ? null : (
                      <div className='mt-5'>
                        <DialogDemo data={item} />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </Card>
      <Card className='col-span-12 md:col-span-3 order-1 md:order-2 h-fit shadow-none'>
        <CardHeader>
          <CardTitle>Sumary</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p>Posted Item: {data?.length}</p>
          <p>Sold Item: 0</p>
          <p>Current Item: 0</p>
        </CardContent>
      </Card>
    </div>
  );
};

const UserPostsTab = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  const [data, setData] = useState<ItemDataType[]>([]);
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
    fetch('http://localhost:5000/api/posts/pending')
      .then((res) => res.json())
      .then((data: ItemDataType[]) => {
        setData(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className='grid grid-cols-12 gap-5 mt-5'>
      <Card className=' mt-5 md:mt-0 col-span-12 md:col-span-9 order-2 md:order-1 border p-2 shadow-none'>
        <h1 className='text-xl font-semibold'>User Pending Posts</h1>
        {data?.length <= 0 && <h1 className='mt-5 text-center'>No item found.</h1>}
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
                          <TableCell>{item.category}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Location</TableCell>
                          <TableCell>
                            {item.location.district + ', ' + item.location.city + ', ' + item.location.country}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Post Date: </TableCell>
                          <TableCell> {new Date(item.createdAt).toLocaleString('default', { hour12: true })}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>End Date</TableCell>
                          <TableCell> {new Date(item.endDate).toLocaleString('default', { hour12: true })}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Start Price</TableCell>
                          <TableCell>$ {item.initialPrice.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Bid Increment</TableCell>
                          <TableCell>$ {item.bidIncrement.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className=' col-span-2 md:col-span-1'>
                    <div className='col-span-2 md:col-span-1 row-span-3 mt-5 md:mt-0'>
                      <div className='flex items-center gap-3 mb-2'>
                        <Avatar>
                          <AvatarImage src={item.seller.pfImgURL} className=' object-cover' />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div>
                          <h3 className='text-lg font-semibold'>{item.seller.name}</h3>
                          <h6 className='text-sm text-muted-foreground'>{item.seller.email}</h6>
                        </div>
                      </div>
                      <Separator />

                      <div>
                        <h1 className='my-2 text-2xl font-semibold'>{item.itemName}</h1>
                        <p className=' text-muted-foreground'>{item.itemDescription}</p>
                      </div>

                      {!user.isModerator ? null : (
                        <div className='flex mt-10 gap-5'>
                          {item.pending ? (
                            <Button className='' onClick={() => handleAccept(item)}>
                              Accept
                            </Button>
                          ) : (
                            <Button variant={'destructive'} onClick={() => handleRemove(item)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </Card>
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

export function DialogDemo({ data }: { data: ItemDataType }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Edit</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Item Name
            </Label>
            <Input id='name' defaultValue={data.itemName} className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Description
            </Label>
            <Textarea id='username' defaultValue={data.itemDescription} className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Category
            </Label>
            <Select defaultValue={data.category}>
              <SelectTrigger className='col-span-3'>
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
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;
