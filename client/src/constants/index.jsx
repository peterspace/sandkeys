import { dubai, moscow, saintpeterburg } from '../assets/img/cities';

import {
  dubai1,
  dubai2,
  dubai3,
  spb1,
  spb2,
  spb3,
  moscow1,
  moscow2,
  spb4,
  spb5,
  hotel,
  apartment,
  resort,
  villa,
} from '../assets/img/attractions';

export const destinations = [
  {
    city: 'Moscow',
    averagePrice: 200,
    propertyCount: 99,
    imageUrl: moscow,
    imageAlt: 'Moscow',
    name: 'moscow',
    title: 'New Moscow City',
    description: `Russia's most international city`,
    price: `600`,

  },
  {
    city: 'Saint Petersburg',
    averagePrice: 150,
    propertyCount: 117,
    imageUrl: saintpeterburg,
    imageAlt: 'Saint petersburg City',
    name: 'saint-petersburg',
    title: '300 Years Park',
    description: `Russia's most cultural and beautiful city`,
    price: `400`,


  },

  {
    city: 'Dubai',
    averagePrice: 300,
    propertyCount: 76,
    imageUrl: dubai1,
    imageAlt: 'Dubai',
    name: 'dubai',
    title: 'Hotel Abu Dhabi',
    description: `Dubai's most beautiful hotel`,
    price: `1000`,

  },
];

export const typesFeatured = [
  {
    place: 'Hotel',
    averagePrice: 200,
    propertyCount: 99,
    imageUrl: hotel,
    imageAlt: 'hotel',
    type: 'hotel',
    title: 'New Moscow City',
    description: `Russia's most international city`,
    price: `600`,
  },
  {
    place: 'Hotel Apart',
    averagePrice: 150,
    propertyCount: 117,
    imageUrl: apartment,
    imageAlt: 'hotelApart',
    type: 'hotelApart',
    title: '300 Years Park',
    description: `Russia's most cultural and beautiful city`,
    price: `400`,
  },

  {
    place: 'Apartment',
    averagePrice: 300,
    propertyCount: 76,
    imageUrl: resort,
    imageAlt: 'apartment',
    type: 'apartment',
    title: 'Hotel Abu Dhabi',
    description: `Dubai's most beautiful hotel`,
    price: `1000`,
  },
];

export const ratesFeatured = [
  {
    city: 'Hotel',
    averagePrice: 200,
    propertyCount: 99,
    imageUrl: moscow,
    imageAlt: 'Hotel',
  },
  {
    city: 'Hotel Apart',
    averagePrice: 150,
    propertyCount: 117,
    imageUrl: saintpeterburg,
    imageAlt: 'Hotel Apart',
  },

  {
    city: 'Apartment',
    averagePrice: 300,
    propertyCount: 76,
    imageUrl: dubai,
    imageAlt: 'Apartment',
  },
];

export const slides = [
  { url: dubai2, title: 'forest' },
  { url: spb1, title: 'boat' },
  { url: spb2, title: 'boat' },
];

// export const sendNotifcation = {
//     id: 'send',
//     message: 'You just paying',
//     amount: 30.235,
//     link: '/https://www.instagram.com/',
//     symbol: 'ETH',
//     sender: '0x235648',
//     receiver: '0x32653',
//     time: '30 seconds ago',
//   };

// export const navLinks = [
//     {
//       id: "home",
//       title: "Home",
//       link:"/",
//     },
//     {
//       id: "profile",
//       title: "My profile",
//       link:"/",
//     },
//     {
//       id: "booking",
//       title: "My bookings",
//       link:"/",
//     },
//     {
//       id: "contact-us",
//       title: "Contact us",
//       link:"/",
//     },

//   ];
