'use client';

import CardsContainer from '@/components/CardsContainer';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

import { PRODUCT_CATEGORIES } from '@/data/List';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

const Browse = () => {
  const [filter, setFilter] = useState({ searchTerm: '', selectedCategory: '' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilter({ searchTerm: e.target.value, selectedCategory });
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setFilter({ searchTerm, selectedCategory: val });
  };

  const handleSortChange = (val: string) => {
    setSelectedSort(val);
  };

  return (
    <MaxWidthWrapper className='my-10 px-5 xl:px-20 gap-5 min-h-[70vh]'>
      <div className=' xl:col-span-10 md:ml-1'>
        <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between'>
          <h1 className=' text-2xl font-semibold'>All Items</h1>
          <div className='grid flex-grow grid-cols-12 items-end gap-2 mt-5 sm:mt-0  sm:ml-5 max-w-[800px]'>
            <div className='relative col-span-12 sm:col-span-6 flex items-center h-fit'>
              <Input
                className='flex-grow full w-full pr-10'
                placeholder='Search item by name'
                value={searchTerm}
                onChange={(e) => handleSearchChange(e)}
              />
              <Search className='absolute right-3 -translate-y-1/2 top-1/2 w-5 text-muted-foreground' />
            </div>

            <div className=' col-span-6 sm:col-span-3'>
              <p className='mb-2'>Categories:</p>
              <Select defaultValue='all' onValueChange={(val) => handleCategoryChange(val)}>
                <SelectTrigger className=''>
                  <SelectValue placeholder='Sort By' />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className=' col-span-6 sm:col-span-3'>
              <p className='mb-2'>Sort By:</p>
              <Select defaultValue='default' onValueChange={(val) => handleSortChange(val)}>
                <SelectTrigger className=''>
                  <SelectValue placeholder='Sort By' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='default'>Default</SelectItem>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                  <SelectItem value='oldest'>Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <CardsContainer
          className='mt-10 md:grid-cols-2'
          searchTerm={filter.searchTerm}
          selectedCategory={filter.selectedCategory}
          selectedSort={selectedSort}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default Browse;
