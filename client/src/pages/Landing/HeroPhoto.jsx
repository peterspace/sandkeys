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
        <div className="flex flex-col justify-center items-center font-extrabold h-[900px]">
          <div className="flex flex-col justify-center items-center text-center">
            <div className="flex flex-row justify-center items-center">
              Rent An Apartment In The Most Beautiful
            </div>
            <p className="m-0">Neighbourhoods Around The World</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPhoto;
