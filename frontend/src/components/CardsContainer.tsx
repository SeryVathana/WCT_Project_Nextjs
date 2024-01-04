import { cn } from '@/lib/utils';
import ItemCard from './ItemCard';
import { ItemDataType } from '@/types/types';

const CardsContainer = ({
  className,
  data,
  itemNumber = data.length,
}: {
  className: string;
  itemNumber?: number;
  data: ItemDataType[];
}) => {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5', className)}>
      {data.slice(0, data?.length).map((item) => {
        return <ItemCard key={item._id} data={item} />;
      })}
    </div>
  );
};

export default CardsContainer;
