import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './carousel.modules.css';
import Promotions from '../cardLinks/Promotions';
import { glow } from '../../assets';

const CarouselPromotions = ({ list }) => {
  const [width, setWidth] = useState(0);
  // const carouselRef = useRef();
  const innerCarouselRef = useRef();

  function handleClick(direction) {
    // width of NftCard + container's gap = 177px + 2rem (32px) = 209px
    let distance = innerCarouselRef.current.getBoundingClientRect().x - 209;

    if (direction === 'left') {
      innerCarouselRef.current.style.transform = `translateX(${
        386 + distance
      }px)`;
    }

    if (direction === 'right') {
      innerCarouselRef.current.style.transform = `translateX(${
        -209 + distance
      }px)`;
    }
  }

  useEffect(() => {
    //width of what's shown on the screen = carouselRef.current.offsetWidth
    //width of the whole carousel = carouselRef.current.scrollWidth
    setWidth(
      innerCarouselRef.current.scrollWidth -
        innerCarouselRef.current.offsetWidth
    );
  }, []);

  return (
    <div
      className="carousel w-[1200px] flex-shrink-0 rounded-xl"
      style={{ backgroundImage: `url(${glow})` }}
    >
      <span className="arrow left " onClick={() => handleClick('left')}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="#343261"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </span>
      <motion.div className="track">
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: 'grabbing' }}
          // className="mt-6 grid grid-flow-row grid-rows-none gap-6 xl:grid-cols-6"
          className="inner-carousel"
          ref={innerCarouselRef}
        >
          {list?.map((item) => (
            <motion.div className="item" key={item._id}>
              <Promotions data={item} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <span className="arrow right" onClick={() => handleClick('right')}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="#343261"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </span>
    </div>
  );
};

export default CarouselPromotions;
