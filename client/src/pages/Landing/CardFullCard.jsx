import { useMemo } from 'react';

const CardFullCard = ({
  imageDimensions,
  destinationName,
  price,
  listingDescription,
  nameColor,
  pricePosition,
  priceFontSize,
  priceFontWeight,
  priceFontFamily,
  priceTextAlign,
  priceDisplay,
  priceWidth,
  priceFlexShrink,
  descriptionAlignSelf,
  descriptionPosition,
  descriptionFontSize,
  descriptionFontFamily,
  descriptionColor,
  descriptionTextAlign,
  descriptionDisplay,
}) => {
  const nameStyle = useMemo(() => {
    return {
      color: nameColor,
    };
  }, [nameColor]);

  const priceStyle = useMemo(() => {
    return {
      position: pricePosition,
      fontSize: priceFontSize,
      fontWeight: priceFontWeight,
      fontFamily: priceFontFamily,
      textAlign: priceTextAlign,
      display: priceDisplay,
      width: priceWidth,
      flexShrink: priceFlexShrink,
    };
  }, [
    pricePosition,
    priceFontSize,
    priceFontWeight,
    priceFontFamily,
    priceTextAlign,
    priceDisplay,
    priceWidth,
    priceFlexShrink,
  ]);

  const descriptionStyle = useMemo(() => {
    return {
      alignSelf: descriptionAlignSelf,
      position: descriptionPosition,
      fontSize: descriptionFontSize,
      fontFamily: descriptionFontFamily,
      color: descriptionColor,
      textAlign: descriptionTextAlign,
      display: descriptionDisplay,
    };
  }, [
    descriptionAlignSelf,
    descriptionPosition,
    descriptionFontSize,
    descriptionFontFamily,
    descriptionColor,
    descriptionTextAlign,
    descriptionDisplay,
  ]);

  return (
    <div className="rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start text-left text-lg text-grey-600 font-body-large self-stretch flex-1">
      <img
        className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
        alt=""
        src={imageDimensions}
      />
      <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
        <div className="self-stretch flex flex-row items-start justify-start">
          <div className="flex-1 relative font-semibold" style={nameStyle}>
            {destinationName}
          </div>
          <div
            className="relative font-semibold text-right inline-block w-[72px] shrink-0"
            style={priceStyle}
          >
            {price}
          </div>
        </div>
        <div
          className="self-stretch relative text-base text-grey-400"
          style={descriptionStyle}
        >
          {listingDescription}
        </div>
      </div>
    </div>
  );
};

export default CardFullCard;
