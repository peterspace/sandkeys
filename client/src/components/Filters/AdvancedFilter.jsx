import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import SpecialProduct from './SpecialProduct';

const AdvancedFilter = () => {
  const dispatch = useDispatch();
  let data = x;
  let selectedHotelData;
  let selectedHotelApartData;

  //============={Filter Ratings}========================
  //   Property rating
  // Includes stars and other ratings

  useEffect(() => {
    if (data !== null || undefined) {
      oneStar();
      twoStar();
      threeStar();
      fourStar();
      fiveStar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function oneStar() {
    let oneStarRating = [];
    let numberOfOneStarRatingCount;
    data?.map(async (b) => {
      if (b.rating === '1' || 1) {
        oneStarRating.push(b);
        numberOfOneStarRatingCount = oneStarRating.length;
        const ratingsData = {
          oneStarRating,
          numberOfOneStarRatingCount,
        };

        dispatch(oneStarItems(ratingsData));
      }
    });
  }

  async function twoStar() {
    let twoStarRating = [];
    let numberOfTwoStarRatingCount;
    data?.map(async (b) => {
      if (b.rating === '2' || 2) {
        twoStarRating.push(b);
        numberOfTwoStarRatingCount = twoStarRating.length;
        const ratingsData = {
          twoStarRating,
          numberOfTwoStarRatingCount,
        };
        dispatch(twoStarItems(ratingsData));
      }
    });
  }

  async function threeStar() {
    let threeStarRating = [];
    let numberOfThreeStarRatingCount;
    data?.map(async (b) => {
      if (b.rating === 3) {
        threeStarRating.push(b);
        numberOfThreeStarRatingCount = threeStarRating.length;
        const ratingsData = {
          threeStarRating,
          numberOfThreeStarRatingCount,
        };
        dispatch(twoStarItems(ratingsData));
      }
    });
  }

  async function fourStar() {
    let fourStarRating = [];
    let numberOfFourStarRatingCount;
    data?.map(async (b) => {
      if (b.rating === 4) {
        fourStarRating.push(b);
        numberOfFourStarRatingCount = fourStarRating.length;
        const ratingsData = {
          fourStarRating,
          numberOfFourStarRatingCount,
        };

        dispatch(fourStarItems(ratingsData));
      }
    });
  }

  async function fiveStar() {
    let fiveStarRating = [];
    let numberOfFiveStarRatingCount;
    data?.map(async (b) => {
      if (b.rating === 5) {
        fiveStarRating.push(b);
        numberOfFiveStarRatingCount = fiveStarRating.length;
        const ratingsData = {
          fiveStarRating,
          numberOfFiveStarRatingCount,
        };
        dispatch(fiveStarItems(ratingsData));
      }
    });
  }

  // unrated
  async function zeroStar() {
    let unratedStarRating = [];
    let numberOfUnratedStarRatingCount;
    data?.map(async (b) => {
      if (b.rating === null || undefined) {
        unratedStarRating.push(b);
        numberOfUnratedStarRatingCount = unratedStarRating.length;
        const ratingsData = {
          unratedStarRating,
          numberOfUnratedStarRatingCount,
        };
        dispatch(zeroStarItems(ratingsData));
      }
    });
  }

  //========================{Popular filters}======================================
  //hotels
  async function hotels() {
    let hotels = [];
    let selectedCity = 'moscow';
    let numberOfhotels;
    data?.map(async (b) => {
      if (b.type === 'hotel' || b.city === selectedCity) {
        hotels.push(b);
        numberOfhotels = hotels.length;
        const hotelsData = {
          hotels,
          numberOfhotels,
        };
        dispatch(setHotels(hotelsData));
      }
    });
  }

  // hoteApartments
  async function hotelAparts() {
    let hotelAparts = [];
    let selectedCity = 'moscow'; // city from user options
    let numberOfhotelAparts;
    data?.map(async (b) => {
      if (b.type === 'hotelAparts' || b.city === selectedCity) {
        hotelAparts.push(b);
        numberOfhotelAparts = hotelAparts.length;
        const hotelApartsData = {
          hotelAparts,
          numberOfhotelAparts,
        };
        dispatch(setHotelAparts(hotelApartsData));
      }
    });
  }

  //========================{Rooms filters}======================================

  // use the "rooms api"
  async function rooms() {
    let rooms = [];
    let selectedCity = 'moscow'; // city from user options
    let selectedHotel = ''; // hotel selected or by default
    let numberOfRooms;
    selectedHotelData?.map(async (b) => {
      if (b.type === 'rooms' || b.city === selectedCity) {
        rooms.push(b);
        numberOfRooms = rooms.length;
        const roomsData = {
          rooms,
          numberOfRooms,
        };
        dispatch(setrooms(roomsData));
      }
    });
  }

  async function singleBed() {
    let singleBed = [];
    let selectedHotel = ''; // hotel selected or by default
    let numberOfSingleBed;
    selectedHotelData?.map(async (b) => {
      if (b.type === 'singleBed' || b.city === selectedCity) {
        singleBed.push(b);
        numberOfSingleBed = singleBed.length;
        const singleBedData = {
          singleBed,
          numberOfSingleBed,
        };
        dispatch(setSingleBed(singleBedData));
      }
    });
  }

  async function doubleBed() {
    let doubleBed = [];
    let selectedHotel = ''; // hotel selected or by default
    let numberOfDoubleBed;
    selectedHotelData?.map(async (b) => {
      if (b.type === 'doubleBed' || b.city === selectedCity) {
        doubleBed.push(b);
        numberOfDoubleBed = doubleBed.length;
        const doubleBedData = {
          doubleBed,
          numberOfDoubleBed,
        };
        dispatch(setDoubleBed(doubleBedData));
      }
    });
  }

  //================={updateProtocols}===============

  // async function updateProtocols() {
  //   if (activeProtocols.length >= 1) {
  //     let protocolsList = [];

  //     for (let i = 0; i < activeProtocols.length; i++) {
  //       let name = activeProtocols[i].name;
  //       protocolsList.push(name);
  //     }

  //     console.log({ protocolsList: protocolsList });

  //     const formattedProtocols = protocolsList.toString();
  //     console.log({ formattedProtocols: formattedProtocols });
  //     setProtocols(formattedProtocols); // Selected Protocols
  //   }
  // }

  return <div>AdvancedFilter
    <>
    <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Special Products</h3>
          </div>
        </div>
        <div className="row">
          {productState &&
            productState?.map((item, index) => {
              if (item?.tags === 'special') {
                return (
                  <SpecialProduct
                    key={index}
                    id={item?._id}
                    brand={item?.brand}
                    title={item?.title}
                    totalrating={item?.totalrating.toString()}
                    price={item?.price}
                    sold={item?.sold}
                    quantity={item?.quantity}
                  />
                );
              } else {
                return null;
              }
            })}
        </div>
      </Container>
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Popular Products</h3>
          </div>
        </div>
        <div className="row">
          {productState &&
            productState?.map((item, index) => {
              if (item?.tags === 'popular') {
                return <ProductCard key={index} data={productState} />;
              } else {
                return null;
              }
            })}
        </div>
      </Container></>
  </div>;
};

export default AdvancedFilter;
