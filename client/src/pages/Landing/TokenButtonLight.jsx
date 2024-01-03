import { useMemo } from 'react';

const TokenButtonLight = ({
  imgCard,
  rUB,
  tokenButtonLightPosition,
  tokenButtonLightTop,
  tokenButtonLightLeft,
  handleclick,
}) => {
  const tokenButtonLightStyle = useMemo(() => {
    return {
      position: tokenButtonLightPosition,
      top: tokenButtonLightTop,
      left: tokenButtonLightLeft,
    };
  }, [tokenButtonLightPosition, tokenButtonLightTop, tokenButtonLightLeft]);

  return (
    <div
      className="rounded-xl bg-gray-100 overflow-hidden flex flex-row items-center justify-start py-1 px-3 gap-[8px] text-left text-[24px] text-grey-200 font-roboto"
      style={tokenButtonLightStyle}
      onClick={handleclick}
    >
      <img
        className="relative rounded-[360px] w-5 h-5 overflow-hidden shrink-0 object-cover"
        alt=""
        src={imgCard}
      />
      <div className="relative">{rUB}</div>
      <img
        className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
        alt=""
        src="/chevrondown@2x.png"
      />
    </div>
  );
};

export default TokenButtonLight;
