import { useMemo } from 'react';

const HeroPhoto = ({ heroPhotoBackgroundImage }) => {
  const heroPhotoStyle = useMemo(() => {
    return {
      backgroundImage: heroPhotoBackgroundImage,
    };
  }, [heroPhotoBackgroundImage]);

  return (
    <div
      className="overflow-hidden flex flex-col items-start justify-start bg-[url('/public/herophoto@3x.png')] bg-cover bg-no-repeat bg-[top] text-left text-[40px] text-white font-body-large self-stretch"
      style={heroPhotoStyle}
    >
      <div className="self-stretch bg-darkslategrey-200 overflow-hidden flex flex-row items-start justify-between p-2.5">
        <div className="flex-1 relative font-extrabold flex items-center h-[900px]">
          {/* <span>
            <p className="[margin-block-start:0] [margin-block-end:8px]">
              Rent An Apartment In The Most Beautiful
            </p>
            <p className="m-0">Neighbourhoods Around The World</p>
          </span> */}

          <div className="flex flex-col justify-center items-center">
            <p>Rent An Apartment In The Most Beautiful</p>
            {/* <p className="m-0">
              Rent An Apartment In The Most Beautiful
            </p> */}
            <p className="m-0">Neighbourhoods Around The World</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPhoto;
