import React, { useState, useEffect } from 'react';
import MenuButton from './MenuButton';
import TokenButtonLight from './TokenButtonLight';

const Header2 = ({ imgCard }) => {
  return (
    <div className="bg-grey-200 overflow-hidden flex flex-row items-start justify-between py-[22px] px-[15px] box-border text-left text-[24px] text-white font-roboto self-stretch">
      <div className="relative w-[340px] h-9">
        <MenuButton
          exchange="Places"
          menuButtonPosition="absolute"
          menuButtonTop="0px"
          menuButtonLeft="133px"
        />
        <MenuButton
          exchange="Partner"
          menuButtonPosition="absolute"
          menuButtonTop="0px"
          menuButtonLeft="253px"
        />
        <div className="absolute top-[0px] left-[0px] w-[93px] h-9">
          <b className="absolute top-[calc(50%_-_14px)] left-[calc(50%_-_46.5px)]">
            Sandkey
          </b>
        </div>
      </div>
      <div className="relative w-[500px] h-9">
        <MenuButton
          exchange="Logout"
          menuButtonPosition="absolute"
          menuButtonTop="0px"
          menuButtonLeft="270px"
        />
        <MenuButton
          exchange="Account"
          menuButtonPosition="absolute"
          menuButtonTop="0px"
          menuButtonLeft="133px"
        />
        <MenuButton
          exchange="Support"
          menuButtonPosition="absolute"
          menuButtonTop="0px"
          menuButtonLeft="0px"
        />
        <TokenButtonLight
          imgCard="/imgcard@2x.png"
          rUB="EN"
          tokenButtonLightPosition="absolute"
          tokenButtonLightTop="0px"
          tokenButtonLightLeft="393px"
        />
      </div>
    </div>
  );
};

export default Header2;
