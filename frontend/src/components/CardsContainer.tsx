import { cn } from '@/lib/utils';
import ItemCard from './ItemCard';

const CardsContainer = ({
  className,
  itemCount,
}: {
  className?: string;
  itemCount?: number | null;
}) => {
  // let numberItems = !itemCount ? data.length;

  // if (!itemCount) {
  //   itemCount =
  // }
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5',
        className
      )}
    >
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <ItemCard />
    </div>
  );
};

export default CardsContainer;
