import CardsContainer from '@/components/CardsContainer';
import { EmailTemplate } from '@/components/EmailTemplate';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { auth } from '@/configs/firebase-config';
import { ItemDataType } from '@/types/types';
import Link from 'next/link';

const API_URL = 'https://auction-site-server.onrender.com';

const getItem = async () => {
  const res = await fetch(`${API_URL}/api/posts`, { next: { revalidate: 10 } });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// export const preload = () => {
//   // void evaluates the given expression and returns undefined
//   // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
//   void getItem();
// };

const Homepage = async () => {
  const data = await getItem();

  return (
    <>
      <MaxWidthWrapper className='flex flex-col justify-center items-center pt-16'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-semibold max-w-xl text-center lg:leading-tight'>
          Unleash the Thrill of the Hunt: <span className='text-blue-500'>Bid Now on Rare Treasures!</span>
        </h1>
        <p className='text-sm sm:text-xl text-center max-w-2xl mt-6'>
          Welcome to a realm where the past whispers secrets and the future beckons with untold possibilities. This is the domain
          of the auction, where dreams take flight and fortunes are made. Dive into a curated selection of unique and exquisite
          items, each with a story waiting to be unearthed.
        </p>

        <div className='flex flex-col sm:flex-row gap-10 mt-10'>
          <Button asChild variant='default' size={'lg'}>
            <Link href='/browse'>Browse more &rarr;</Link>
          </Button>
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper className='my-20'>
        <div className='flex items-center justify-between'>
          <h1 className=' text-2xl font-semibold'>We got for you</h1>

          <Button asChild variant={'ghost'}>
            <Link href={'/browse'}>See more &rarr;</Link>
          </Button>
        </div>
        <CardsContainer inputData={data} itemNumber={4} className='mt-5' />
      </MaxWidthWrapper>
    </>
  );
};

export default Homepage;
