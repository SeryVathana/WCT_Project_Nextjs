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
import { Dispatch, FormEvent, MouseEvent, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Item } from 'firebase/analytics';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRODUCT_CATEGORIES } from '@/data/List';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { hi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Profile = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);

  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged(async (userCred) => {
      if (!userCred) {
        router.push('/sign-in');
      }
    });
  }, [user.isAuth, router]);

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
  const [isEdited, setIsEdited] = useState<boolean>(false);

  useEffect(() => {
    if (user.isAuth) {
      axios
        .get(`${API_URL}/user/${user.userID}`)
        .then((res) => {
          setUserInfo(res.data[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setIsEdited(false);
  }, [user, isEdited]);

  const giveDateTime = (inputDate: string | undefined) => {
    if (!inputDate) {
      return;
    }

    const today = new Date(inputDate);
    const date = ('0' + today.getDate()).slice(-2) + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + today.getFullYear();
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
          <EditUserDialog data={userInfo!} setIsEdited={setIsEdited} />
          <Button variant={'destructive'}>Change Password</Button>
        </div>
      </div>
    </div>
  );
};

const MyPostsTab = () => {
  const user = useSelector((state: RootState) => state.authSlice.value);
  const [data, setData] = useState<ItemDataType[]>([]);
  const [deleted, setDeleted] = useState<boolean>(false);

  const [isEdited, setIsEdited] = useState<boolean>(false);

  useEffect(() => {
    if (auth.currentUser) {
      axios.get(`${API_URL}/api/posts/mypost/${user.userID}`).then((res) => setData(res.data));
    }

    setIsEdited(false);
    setDeleted(false);
  }, [user.userID, deleted, isEdited]);

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
                          <TableCell className='font-medium'>Start Date: </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleString('default', { hour12: true })}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>End Date</TableCell>
                          <TableCell>{new Date(item.endDate).toLocaleString('default', { hour12: true })}</TableCell>
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
                    <div className='flex gap-5'>
                      <div className='mt-5'>
                        <EditPostDialog data={item} setIsEdited={setIsEdited} />
                      </div>
                      <div className='mt-5'>
                        <AlertEditPostDialog id={item._id} setDeleted={setDeleted} />
                      </div>
                    </div>
                    {!item.pending ? (
                      <h1 className='text-md mt-3 text-destructive'>
                        Warning: After changed, your post will back to pending state.
                      </h1>
                    ) : null}
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
    const reqData = {
      pending: false,
    };

    axios.patch(`${API_URL}/api/posts/${inputItem._id}`, reqData).then(() => {
      setData((prev) => prev?.map((item) => (item._id === inputItem._id ? { ...item, pending: false } : item)));
    });
  };
  const handleRemove = (inputItem: ItemDataType) => {
    const reqData = {
      pending: true,
    };

    axios.patch(`${API_URL}/api/posts/${inputItem._id}`, reqData).then(() => {
      setData((prev) => prev?.map((item) => (item._id === inputItem._id ? { ...item, pending: true } : item)));
    });
  };

  useEffect(() => {
    fetch(`${API_URL}/api/posts/pending`)
      .then((res) => res.json())
      .then((data: ItemDataType[]) => {
        setData(data);
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
                        <Avatar className='border'>
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
                              Set Public
                            </Button>
                          ) : (
                            <Button variant={'destructive'} onClick={() => handleRemove(item)}>
                              Set Private
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

function EditUserDialog({ data, setIsEdited }: { data: UserInfoType; setIsEdited: Dispatch<SetStateAction<boolean>> }) {
  const [open, setOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [errorFirstName, setErrorFirstName] = useState<boolean>(false);
  const [errorLastName, setErrorLastName] = useState<boolean>(false);
  const [errorBirthDate, setErrorBirthDate] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorFirstName(firstName.trim().length < 3);
    setErrorLastName(lastName.trim().length < 3);

    const birthYear = new Date(birthDate).getFullYear();
    setErrorBirthDate(2024 - birthYear < 18);

    if (firstName.trim().length < 3 || lastName.trim().length < 3) return;
    if (2024 - birthYear < 18) return;

    setUploading(true);

    const reqBody = {
      firstName,
      lastName,
      birthDate: new Date(birthDate).toISOString(),
    };

    console.log(reqBody);

    axios.patch(`${API_URL}/user/${data._id}`, { reqBody }).then(() => {
      setIsEdited(true);
      setOpen(false);
    });

    setUploading(false);
  };

  const getNormalDate = (date: string) => {
    const endDay = ('0' + new Date().getDate()).slice(-2);
    const endMonth = ('0' + new Date(date).getMonth() + 1).slice(-2);
    const endYear = new Date(date).getFullYear();

    const endDate = `${endYear}-${endMonth}-${endDay}`;

    return endDate;
  };

  useEffect(() => {
    setFirstName(data?.firstName);
    setLastName(data?.lastName);
    setBirthDate(getNormalDate(data?.birthDate));
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default' onClick={() => setOpen(true)}>
          Change Information
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] overflow-y-auto h-screen md:h-auto'>
        <DialogHeader>
          <DialogTitle>Change Your Info</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e)} className='space-y-5'>
          <div className='grid grid-cols-4 items-center'>
            <Label className=' col-span-1'>First Name</Label>

            <Input
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={cn('col-span-3', { 'border border-red-500': errorFirstName })}
            />
          </div>
          <div className='grid grid-cols-4 items-center'>
            <Label className=' col-span-1'>Last Name</Label>
            <Input
              type='text'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={cn('col-span-3', { 'border border-red-500': errorLastName })}
            />
          </div>
          <div className='grid grid-cols-4 items-center'>
            <Label className=' col-span-1'>Birth Date</Label>
            <Input
              placeholder='End Date'
              type='date'
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
              }}
              className={cn('col-span-3', { 'border border-red-500': errorBirthDate })}
            />
          </div>

          <DialogFooter>
            <Button type='submit' disabled={uploading}>
              {uploading ? 'Loading' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function EditPostDialog({ data, setIsEdited }: { data: ItemDataType; setIsEdited: Dispatch<SetStateAction<boolean>> }) {
  const [category, setCategory] = useState<string>(data.category);
  const [endDate, setEndDate] = useState<string>('2023-01-01');
  const [endTime, setEndTime] = useState<string>('00:00');
  const [uploading, setUploading] = useState<boolean>(false);

  const formSchema = z.object({
    itemName: z.string({ required_error: 'Please enter item name' }).min(2, 'Input must be atleast 2 characters.').max(50),
    itemDescription: z
      .string({ required_error: 'Please enter item description' })
      .min(2, 'Input must be atleast 2 characters.')
      .max(250),
    initialPrice: z.coerce.number({ required_error: 'Please enter start price' }).int().min(1),
    bidIncrement: z.coerce
      .number({ required_error: 'Please enter bidding increment' })
      .int({ message: 'Number must be integer' })
      .min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: data.itemName,
      itemDescription: data.itemDescription,
      initialPrice: Number(data.initialPrice),
      bidIncrement: Number(data.bidIncrement),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setUploading(true);

    console.log(values);
    const endDateTime = new Date(endDate + ' ' + endTime).toISOString();

    axios.patch(`${API_URL}/api/posts/${data._id}`, {
      changedInfo: { ...values, category: category, endDate: endDateTime, pending: true },
    });

    setUploading(false);
    setIsEdited(true);
  };

  const getEndDate = () => {
    const endDay = ('0' + new Date(data.endDate).getDate()).slice(-2);
    const endMonth = ('0' + new Date(data.endDate).getMonth() + 1).slice(-2);
    const endYear = new Date(data.endDate).getFullYear();

    const endDate = `${endYear}-${endMonth}-${endDay}`;

    return endDate;
  };

  const getEndTime = () => {
    const endHour = ('0' + new Date(data.endDate).getHours()).slice(-2);
    const endMinute = ('0' + new Date(data.endDate).getMinutes()).slice(-2);
    return endHour + ':' + endMinute;
  };

  useEffect(() => {
    setEndDate(String(getEndDate()));
    setEndTime(String(getEndTime()));
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default'>Edit</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] overflow-y-auto h-screen md:h-auto'>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
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
                <Label>Category</Label>
                <Select defaultValue={data.category} onValueChange={(e) => setCategory(e)}>
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
              </div>

              <DialogFooter>
                <Button type='submit' disabled={uploading}>
                  {uploading ? 'Loading' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AlertEditPostDialog({ id, setDeleted }: { id: string; setDeleted: Dispatch<SetStateAction<boolean>> }) {
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    console.log('Delete');

    axios.delete(`${API_URL}/api/posts/${id}`).then((res) => {
      console.log(res);

      console.log('Deleted');

      setOpen(false);
      setDeleted(true);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' onClick={() => setOpen(true)}>
          Delete Forever
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your item and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleDelete(e)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Profile;
