import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const banner = {
  animate: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

// const letterAni = {
//   initial: { y: 400 },
//   animate: {
//     y: 0,
//     transition: {
//       ease: [0.6, 0.01, -0.05, 0.95],
//       duration: 1,
//     },
//   },
// };

const letterAni = {
  initial: { y: 400 },
  animate: {
    y: 0,
    transition: {
      ease: [0.6, 0.01, -0.05, 0.95],
      duration: 1,
    },
  },
};

const Banner = (props) => {
  const { language } = props;
  const [playMarquee, setPlayMarquee] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPlayMarquee(true);
    }, 2000);
  }, []);
  return (
    // <motion.div className="banner" variants={banner}>
    //   <BannerRowTop title={'Experience'} />
    //   <BannerRowCenter title={`endless`} playMarquee={playMarquee} />
    //   <BannerRowBottom title={'comfort'} />
    // </motion.div>
    <motion.div className="banner" variants={banner}>
      {language?.symbol === 'EN' && (
        <>
          <BannerRowTop title={'Experience'} />
          <BannerRowCenter title={`endless`} playMarquee={playMarquee} />
          <BannerRowBottom title={'comfort'} />
        </>
      )}
      {language?.symbol === 'RU' && (
        <>
          <BannerRowTop title={'Опыт'} />
          <BannerRowCenter title={`бесконечный`} playMarquee={playMarquee} />
          <BannerRowBottom title={'комфорт'} />
        </>
      )}
      {language?.symbol === 'AR' && (
        <>
          <BannerRowTop title={`خبرة`} />
          <BannerRowCenter title={`بلا نهاية`} playMarquee={playMarquee} />
          <BannerRowBottom title={`راحة`} />
        </>
      )}
    </motion.div>
  );
};

const AnimatedLetters = ({ title, disabled }) => (
  <motion.span
    className="row-title"
    variants={disabled ? null : banner}
    initial="initial"
    animate="animate"
  >
    {[...title].map((letter) => (
      <motion.span
        className="row-letter"
        variants={disabled ? null : letterAni}
      >
        {letter}
      </motion.span>
    ))}
  </motion.span>
);

const BannerRowTop1 = ({ title }) => {
  return (
    <div className={'banner-row'}>
      <div className="row-col">
        <AnimatedLetters title={title} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ease: 'easeInOut',
          duration: 1,
          delay: 0.4,
        }}
        className="row-col"
      >
        <span className="row-message">
              Find the most suitable and affordable booking for your holiday
            </span>
        {/* <>
          {language?.symbol === 'EN' && (
            <span className="row-message">
              Find the most suitable and affordable booking for your holiday
            </span>
          )}
          {language?.symbol === 'RU' && (
            <span className="row-message">
              {
                'Найдите наиболее подходящее и доступное бронирование для вашего отпуска'
              }
            </span>
          )}
          {language?.symbol === 'AR' && (
            <span className="row-message">
              {`ابحث عن الحجز الأنسب وبأسعار معقولة لعطلتك`}
            </span>
          )}
        </> */}
      </motion.div>
    </div>
  );
};

const BannerRowTop = ({ title }) => {
  return (
    
    <div className={'banner-row'}>
      <div className="row-col">
        <AnimatedLetters title={title} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ease: 'easeInOut',
          duration: 1,
          delay: 0.4,
        }}
        className="row-col"
      >
        <span className="row-message">
              Find the most suitable and affordable booking for your holiday
            </span>
       
      </motion.div>
    </div>
  );
};

const BannerRowBottom = ({ title }) => {
  return (
    <div className={'banner-row center'}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ease: [0.6, 0.01, -0.05, 0.95], duration: 1, delay: 1 }}
        className="scroll"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: 'easeInOut',
            duration: 1,
            delay: 1.8,
          }}
        >
          scroll
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: 'easeInOut',
            duration: 1,
            delay: 1.8,
          }}
        >
          down
        </motion.span>
      </motion.div>
      <AnimatedLetters title={title} />
    </div>
  );
};

const BannerRowCenter = ({ title, playMarquee }) => {
  return (
    <div className={`banner-row marquee  ${playMarquee && 'animate'}`}>
      <motion.div
        initial={{ y: 310 }}
        animate={{ y: 0 }}
        transition={{ ease: [0.6, 0.01, -0.05, 0.9], duration: 1 }}
        className="marquee__inner"
      >
        <AnimatedLetters title={title} disabled />
        <AnimatedLetters title={title} />
        <AnimatedLetters title={title} disabled />
        <AnimatedLetters title={title} disabled />
      </motion.div>
    </div>
  );
};

export default Banner;
