import { useMemo } from "react";

const TestimonialRow = ({
  tripma,
  arrowRight,
  avatar,
  starFilled,
  starFilled1,
  starFilled2,
  starFilled3,
  starUnfilled,
  avatar1,
  starFilled4,
  starFilled5,
  starFilled6,
  starFilled7,
  starFilled8,
  ratingStarRowBoxSizing,
  ratingStarRowBoxSizing1,
  ratingStarRowBoxSizing2,
}) => {
  const ratingStarRow1Style = useMemo(() => {
    return {
      boxSizing: ratingStarRowBoxSizing,
    };
  }, [ratingStarRowBoxSizing]);

  const ratingStarRow2Style = useMemo(() => {
    return {
      boxSizing: ratingStarRowBoxSizing1,
    };
  }, [ratingStarRowBoxSizing1]);

  const ratingStarRow3Style = useMemo(() => {
    return {
      boxSizing: ratingStarRowBoxSizing2,
    };
  }, [ratingStarRowBoxSizing2]);

  const testimonial1 =
    "What a great experience using CRIB! I booked all of my hotel stays for my gap year through CRIB and never had any issues. When I had to cancel a reservation because of an emergency, CRIB customer support helped me navigate the process smoothly and got me a full refund within days. The app's interface makes comparing hotel amenities and prices so simple - I found hidden gems in every city!";
  const testimonial2 =
    "My family and I visit Hawaii every year, and we usually book our hotels using other services. CRIB was recommended to us by a longtime friend, and I'm so glad we tried it out! The process was easy and intuitive - we found the perfect beachfront resort with family suites that fit our budget. The loyalty points we earned on this booking already gave us a discount on our next stay!";
  const testimonial3 =
    "When I was looking to book my hotel in Berlin, CRIB had the best browsing experience with clear photos, honest reviews, and detailed neighborhood guides. I figured I'd give it a try for my first international trip. It was my first time using CRIB, but I'd definitely recommend it to a friend and use it for all my future travels. The price-match guarantee gave me confidence I was getting the best deal available.";

  return (
    <div className="flex flex-col items-center justify-start p-16 box-border gap-[24px] text-left text-[24px] text-grey-600 font-body-large self-stretch">
      <div className="flex flex-row items-start justify-start gap-[826px]">
        <b className="relative">
          <span>{`What `}</span>
          <span className="text-mediumslateblue">{tripma}</span>
          <span> users are saying</span>
        </b>
        <div className="shrink-0 hidden flex-row items-center justify-start gap-[4px] text-right text-grey-300">
          <div className="relative">All</div>
          <img
            className="relative rounded w-8 h-8 overflow-hidden shrink-0 object-cover"
            alt=""
            src={arrowRight}
          />
        </div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-start gap-[40px] text-lg">
        <div className="flex-1 shrink-0 flex flex-row items-start justify-start p-4 gap-[16px]">
          <img
            className="relative rounded-[50%] w-12 h-12 object-cover"
            alt=""
            src="/avatar@2x.png"
          />
          <div className="flex-1 flex flex-col items-start justify-start gap-[12px]">
            <div className="self-stretch flex flex-col items-start justify-start">
              <div className="self-stretch relative font-semibold">
                Yifei Chen
              </div>
              <div className="self-stretch relative">
                <span>{`Seoul, South Korea `}</span>
                <span className="text-grey-300">|</span>
                <span> April 2019</span>
              </div>
              <div
                className="flex flex-row items-start justify-start pt-2 px-0 pb-0"
                style={ratingStarRow1Style}
              >
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src="/24--star-filled@2x.png"
                />
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src="/24--star-filled@2x.png"
                />
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src="/24--star-filled@2x.png"
                />
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src="/24--star-filled@2x.png"
                />
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src="/24--star-filled@2x.png"
                />
              </div>
            </div>
            <div className="self-stretch relative text-grey-100">
              {/* <span>{`What a great experience using Tripma! I booked all of my flights for my gap year through Tripma and never had any issues. When I had to cancel a flight because of an emergency, Tripma support helped me `}</span> */}
              <span>
                {testimonial1.length > 100
                  ? `${testimonial1.slice(0, 100)}... `
                  : testimonial1}
              </span>
              <span className="text-mediumslateblue">read more...</span>
            </div>
          </div>
        </div>
        <div className="flex-1 shrink-0 flex flex-row items-start justify-start p-4 gap-[16px]">
          <img
            className="relative rounded-[50%] w-12 h-12 object-cover"
            alt=""
            src={avatar}
          />
          <div className="flex-1 flex flex-col items-start justify-start gap-[12px]">
            <div className="self-stretch flex flex-col items-start justify-start">
              <div className="self-stretch relative font-semibold">
                Kaori Yamaguchi
              </div>
              <div className="self-stretch relative">
                <span>{`Honolulu, Hawaii `}</span>
                <span className="text-grey-300">|</span>
                <span> February 2023</span>
              </div>
              <div
                className="flex flex-row items-start justify-start pt-2 px-0 pb-0"
                style={ratingStarRow2Style}
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
              {/* <span>{`My family and I visit Hawaii every year, and we usually book our flights using other services. Tripma was recommened to us by a long time friend, and I’m so glad we tried it out! The process was easy and `}</span> */}

              <span>
                {testimonial2.length > 100
                  ? `${testimonial2.slice(0, 100)}... `
                  : testimonial2}
              </span>
              <span className="text-mediumslateblue">read more...</span>
            </div>
          </div>
        </div>
        <div className="flex-1 shrink-0 flex flex-row items-start justify-start p-4 gap-[16px]">
          <img
            className="relative rounded-[50%] w-12 h-12 object-cover"
            alt=""
            src={avatar1}
          />
          <div className="flex-1 flex flex-col items-start justify-start gap-[12px]">
            <div className="self-stretch flex flex-col items-start justify-start">
              <div className="self-stretch relative font-semibold">
                Anthony Lewis
              </div>
              <div className="self-stretch relative">
                <span>{`Berlin, Germany `}</span>
                <span className="text-grey-300">|</span>
                <span> April 2019</span>
              </div>
              <div
                className="flex flex-row items-start justify-start pt-2 px-0 pb-0"
                style={ratingStarRow3Style}
              >
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src={starFilled4}
                />
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src={starFilled5}
                />
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src={starFilled6}
                />
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src={starFilled7}
                />
                <img
                  className="relative rounded w-6 h-6 overflow-hidden shrink-0 object-cover"
                  alt=""
                  src={starFilled8}
                />
              </div>
            </div>
            <div className="self-stretch relative text-grey-100">
              {/* <span>{`When I was looking to book my flight to Berlin from LAX, Tripma had the best browsing experiece so I figured I’d give it a try. It was my first time using Tripma, but I’d definitely recommend it to a friend and use it for `}</span> */}
              <span>
                {testimonial3.length > 100
                  ? `${testimonial3.slice(0, 100)}... `
                  : testimonial3}
              </span>
              <span className="text-mediumslateblue">read more...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialRow;
