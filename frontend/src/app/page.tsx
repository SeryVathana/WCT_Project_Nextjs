import CardsContainer from '@/components/CardsContainer';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const getItem = async () => {
  const data = await fetch('http://localhost:5000/api/posts', { cache: 'no-store' });
  return data.json();
};

const Homepage = async () => {
  // const dispatch = useDispatch();
  // const [data, setData] = useState([]);

  const data = await getItem();

  // useEffect(() => {
  // auth.onAuthStateChanged(async (userCred) => {
  //   console.log(userCred);
  //   if (userCred) {
  //     const token = await userCred.getIdToken();
  //     dispatch(
  //       logIn({
  //         uid: userCred.uid,
  //         username: userCred.displayName,
  //         email: userCred.email,
  //         token: token,
  //         pfURL: userCred.photoURL,
  //       })
  //     );
  //     console.log(userCred.uid);
  //   }
  // });
  // }, []);

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
          <Button asChild size={'lg'}>
            <Link href='/sign-up'>Join Us</Link>
          </Button>
          <Button asChild variant={'link'} size={'lg'}>
            <Link href='/browse'>Browse more &rarr;</Link>
          </Button>
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper className='my-20'>
        <div className='flex items-center justify-between'>
          <h1 className=' text-2xl font-semibold'>Popular Bidding</h1>

          <Button asChild variant={'ghost'}>
            <Link href={'/browse'}>See more &rarr;</Link>
          </Button>
        </div>
        <CardsContainer itemNumber={5} data={data} className='mt-5' />
      </MaxWidthWrapper>
    </>
  );
};

export default Homepage;
