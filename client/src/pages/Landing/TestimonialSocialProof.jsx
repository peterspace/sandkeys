import { useMemo } from 'react';

const TestimonialSocialProof = ({
  avatar,
  firstLast,
  tokyoJapan,
  april2019,
  starFilled,
  starFilled1,
  starFilled2,
  starFilled3,
  starUnfilled,
  thisIsAReviewOfMyStayAtLo,
  testimonialSocialProofFlexShrink,
  ratingStarRowBoxSizing,
}) => {
  const testimonialSocialProofStyle = useMemo(() => {
    return {
      flexShrink: testimonialSocialProofFlexShrink,
    };
  }, [testimonialSocialProofFlexShrink]);

  const ratingStarRowStyle = useMemo(() => {
    return {
      boxSizing: ratingStarRowBoxSizing,
    };
  }, [ratingStarRowBoxSizing]);

  return (
    <div
      className="flex flex-row items-start justify-start p-4 box-border gap-[16px] text-left text-lg text-grey-600 font-body-large flex-1"
      style={testimonialSocialProofStyle}
    >
      <img
        className="relative rounded-[50%] w-12 h-12 object-cover"
        alt=""
        src={avatar}
      />
      <div className="flex-1 flex flex-col items-start justify-start gap-[12px]">
        <div className="self-stretch flex flex-col items-start justify-start">
          <div className="self-stretch relative font-semibold">{firstLast}</div>
          <div className="self-stretch relative">
            <span>{tokyoJapan}</span>
            <span className="text-grey-300">|</span>
            <span>{april2019}</span>
          </div>
          <div
            className="flex flex-row items-start justify-start pt-2 px-0 pb-0"
            style={ratingStarRowStyle}
          >
            <img
              className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
              alt=""
              src={starFilled}
            />
            <img
              className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
              alt=""
              src={starFilled1}
            />
            <img
              className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
              alt=""
              src={starFilled2}
            />
            <img
              className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
              alt=""
              src={starFilled3}
            />
            <img
              className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
              alt=""
              src={starUnfilled}
            />
          </div>
        </div>
        <div className="self-stretch relative text-grey-100">
          <span>{thisIsAReviewOfMyStayAtLo}</span>
          <span className="text-mediumslateblue">read more...</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSocialProof;
