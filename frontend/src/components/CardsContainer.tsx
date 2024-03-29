'use client';

import { cn } from '@/lib/utils';
import ItemCard from './ItemCard';
import { ItemDataType } from '@/types/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCardSkeleton from './ItemCardSkeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CardsContainer = ({
  inputData = [],
  className,
  searchTerm,
  selectedCategory,
  selectedSort = '',
  itemNumber,
}: {
  inputData?: ItemDataType[];
  className?: string;
  searchTerm?: string;
  selectedCategory?: string;
  selectedSort?: string;
  itemNumber?: number;
}) => {
  const [data, setData] = useState<ItemDataType[]>(inputData);
  const [backUpData, setBackUpData] = useState<ItemDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/posts`, {
        params: {
          name: searchTerm,
          category: selectedCategory,
        },
      })
      .then((res) => {
        if (selectedSort) {
          if (selectedSort == 'name') {
            setData([...res.data].sort((a, b) => a.itemName.localeCompare(b.itemName)));
          } else if (selectedSort == 'newest') {
            setData([...res.data].sort((a, b) => isoToTimestamp(b.createdAt) - isoToTimestamp(a.createdAt)));
          } else if (selectedSort == 'oldest') {
            setData([...res.data].sort((a, b) => isoToTimestamp(a.createdAt) - isoToTimestamp(b.createdAt)));
          } else {
            setData(res.data);
          }
        } else {
          setData(res.data);
        }

        setBackUpData(res.data);
        setLoading(false);
      });
  }, [searchTerm, selectedCategory]);

  function isoToTimestamp(isoString: Date) {
    const date = new Date(isoString);
    return date.getTime();
  }

  useEffect(() => {
    if (selectedSort == 'name') {
      setData([...data].sort((a, b) => a.itemName.localeCompare(b.itemName)));
    } else if (selectedSort == 'newest') {
      setData([...data].sort((a, b) => isoToTimestamp(b.createdAt) - isoToTimestamp(a.createdAt)));
    } else if (selectedSort == 'oldest') {
      setData([...data].sort((a, b) => isoToTimestamp(a.createdAt) - isoToTimestamp(b.createdAt)));
    } else {
      setData(backUpData);
    }
  }, [selectedSort]);

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5', className)}>
      {loading ? (
        <>
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
        </>
      ) : (
        <>
          {!loading && data.length <= 0 ? (
            <h1>No item found.</h1>
          ) : (
            <>
              {data.slice(0, itemNumber ?? data?.length).map((item) => {
                return <ItemCard key={item._id} data={item} />;
              })}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CardsContainer;
