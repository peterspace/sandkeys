const RatingStarRow = ({
  imageId,
  imageIdText,
  imageIdList,
  imageIdTextList,
  imageIdTextList2,
}) => {
  return (
    <div className="flex flex-row items-start justify-start pt-2 px-0 pb-0">
      <img
        className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
        alt=""
        src={imageId}
      />
      <img
        className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
        alt=""
        src={imageIdText}
      />
      <img
        className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
        alt=""
        src={imageIdList}
      />
      <img
        className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
        alt=""
        src={imageIdTextList}
      />
      <img
        className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
        alt=""
        src={imageIdTextList2}
      />
    </div>
  );
};

export default RatingStarRow;
