import { useMemo } from 'react';

const TypesFeatured = ({
  flightDeals,
  image,
  theBund,
  shanghai,
  image1,
  sydneyOperaHouse,
  sydney,
  image2,
  kdaijiTemple,
  kyoto,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  description,
  image9,
  showCardFullCard,
  cardRowAlignItems,
}) => {
  const cardRowStyle = useMemo(() => {
    return {
      alignItems: cardRowAlignItems,
    };
  }, [cardRowAlignItems]);

  return (
    <div
      className="overflow-x-auto flex flex-col items-start justify-start py-10 px-16 box-border gap-[24px] text-left text-[24px] text-grey-600 font-body-large self-stretch"
      style={cardRowStyle}
    >
      <div className="self-stretch flex flex-row items-start justify-between">
        <b className="relative">
          <span>{`Find your next adventure with these `}</span>
          <span className="text-mediumslateblue">{flightDeals}</span>
        </b>
        <div className="shrink-0 flex flex-row items-center justify-start gap-[4px] text-right text-grey-300">
          <div className="relative">All</div>
          <img
            className="relative rounded w-8 h-8 overflow-hidden shrink-0 object-cover"
            alt=""
            src="/32--arrowright@2x.png"
          />
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[40px] text-lg">
        <div className="self-stretch flex flex-row items-start justify-start gap-[40px]">
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  <span>{theBund}</span>
                  <span className="text-mediumslateblue">{shanghai}</span>
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $598
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                China’s most international city
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image1}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  <span>{sydneyOperaHouse}</span>
                  <span className="text-mediumslateblue">{sydney}</span>
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $981
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                Take a stroll along the famous harbor
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image2}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  <span>{kdaijiTemple}</span>
                  <span className="text-mediumslateblue">{kyoto}</span>
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $633
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                Step back in time in the Gion district
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image3}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  <span>{`Tsavo East National Park, `}</span>
                  <span className="text-mediumslateblue">Kenya</span>
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $1,000
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                Situated in a semi-arid area previously known as the Taru Desert
                it opened in April 1948. Named after the Tsavo River, Tsavo East
                National Park is one of the oldest and largest parks in Kenya.
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image4}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  Destination name
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $1,000
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                One line description
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch hidden flex-row items-start justify-start gap-[40px]">
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image5}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  <span>The Bund,</span>
                  <span className="text-mediumslateblue"> Shanghai</span>
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $598
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                China’s most international city
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image6}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  <span>Sydney Opera House,</span>
                  <span className="text-mediumslateblue"> Sydney</span>
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $981
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                Take a stroll along the famous harbor
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image7}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  <span>Kōdaiji Temple,</span>
                  <span className="text-mediumslateblue"> Kyoto</span>
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $633
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                Step back in time in the Gion district
              </div>
            </div>
          </div>
          {showCardFullCard && (
            <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
              <img
                className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                alt=""
                src={image8}
              />
              <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                <div className="self-stretch flex flex-row items-start justify-start">
                  <div className="flex-1 relative font-semibold">
                    <span>{`Tsavo East National Park, `}</span>
                    <span className="text-mediumslateblue">Kenya</span>
                  </div>
                  <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                    $1,248
                  </div>
                </div>
                <div className="self-stretch relative text-base text-grey-400">
                  {description}
                </div>
              </div>
            </div>
          )}
          <div className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
              alt=""
              src={image9}
            />
            <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
              <div className="self-stretch flex flex-row items-start justify-start">
                <div className="flex-1 relative font-semibold">
                  Destination name
                </div>
                <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                  $1,000
                </div>
              </div>
              <div className="self-stretch relative text-base text-grey-400">
                One line description
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationsFeaturedCard;
