
// import { usePathname, useSearchParams } from 'next/navigation';
import { useSearchParams, useLocation } from "react-router-dom";
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { 
  GiBarn, 
  GiBoatFishing, 
  GiCactus, 
  GiCastle, 
  GiCaveEntrance, 
  GiForestCamp, 
  GiIsland,
  GiWindmill
} from 'react-icons/gi';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';

import CategoryBox from "./CategoryBox";
import Container from './Container';


export const categories = [
  {
    label: 'Beach',
    icon: TbBeach,
    description: 'This property is close to the beach!',
  },
  {
    label: 'Windmills',
    icon: GiWindmill,
    description: 'This property is has windmills!',
  },
  {
    label: 'Modern',
    icon: MdOutlineVilla,
    description: 'This property is modern!'
  },
  {
    label: 'Countryside',
    icon: TbMountain,
    description: 'This property is in the countryside!'
  },
  {
    label: 'Studio',
    icon: FaSkiing,
    description: 'This room is a cozy studio for your vacation!'
  },
  {
    label: 'Suite',
    icon: GiCastle,
    description: 'This room is a royal suite!'
  },
  {
    label: 'Standard',
    icon: GiForestCamp,
    description: 'This is a Standard accomodation for your holiday!'
  },
  {
    label: 'Arctic',
    icon: BsSnow,
    description: 'This property is in arctic environment!'
  },
  {
    label: 'Desert',
    icon: GiCactus,
    description: 'This property is in the desert!'
  },
  {
    label: 'Delux',
    icon: IoDiamond,
    description: 'This room is brand new and luxurious!'
  }
]

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const location = useLocation()
  const pathname = location?.pathname;

  // const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
          pt-4
          flex 
          flex-row 
          items-center 
          justify-between
          overflow-x-auto
        "
      >
        {categories.map((item) => (
          <CategoryBox 
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
}
 
export default Categories;