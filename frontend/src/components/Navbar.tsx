import Link from 'next/link';

import MaxWidthWrapper from './MaxWidthWrapper';

import NavActions from './NavActions';

const NAVLINK = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Browse',
    href: '/browse',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

const Navbar = async () => {
  return (
    <div className=' bg-white sticky top-0 z-50  border-b border-b-gray-100 h-16 flex items-center'>
      <MaxWidthWrapper>
        <div className='flex items-center'>
          <Link href={'/'}>
            <h1 className=' text-xl text-blue-500 font-semibold mr-20'>auctionaire</h1>
          </Link>

          <nav className='hidden lg:flex lg:items-center lg:gap-10'>
            {NAVLINK.map((link) => {
              return (
                <Link key={link.label} href={link.href} className='transition-all hover:opacity-50'>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <NavActions />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
