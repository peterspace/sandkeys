const LandingPageContainer = () => {
  return (
    <div className="relative bg-true-white w-full overflow-hidden flex flex-col items-start justify-start text-left text-5xl text-silver font-roboto">
      {/* Header starts */}
      <div className="self-stretch bg-gray-200 overflow-hidden flex flex-row items-start justify-between py-[22px] px-[15px]">
        <div className="relative w-[340px] h-9">
          <div className="absolute top-[0px] left-[133px] rounded-lg bg-darkslategray-200 overflow-hidden flex flex-row items-start justify-start p-1">
            <div className="relative">Places</div>
          </div>
          <div className="absolute top-[0px] left-[253px] rounded-lg bg-darkslategray-200 overflow-hidden flex flex-row items-start justify-start p-1">
            <div className="relative">Partner</div>
          </div>
          <div className="absolute top-[0px] left-[0px] w-[93px] h-9 text-true-white">
            <b className="absolute top-[calc(50%_-_14px)] left-[calc(50%_-_46.5px)]">
              Sandkey
            </b>
          </div>
        </div>
        <div className="relative w-[500px] h-9">
          <div className="absolute top-[0px] left-[270px] rounded-lg bg-darkslategray-200 overflow-hidden flex flex-row items-start justify-start p-1">
            <div className="relative">Logout</div>
          </div>
          <div className="absolute top-[0px] left-[133px] rounded-lg bg-darkslategray-200 overflow-hidden flex flex-row items-start justify-start p-1">
            <div className="relative">Account</div>
          </div>
          <div className="absolute top-[0px] left-[0px] rounded-lg bg-darkslategray-200 overflow-hidden flex flex-row items-start justify-start p-1">
            <div className="relative">Support</div>
          </div>
          <div className="absolute top-[0px] left-[393px] rounded-xl bg-whitesmoke overflow-hidden flex flex-row items-center justify-start py-1 px-3 gap-[8px] text-gray-200">
            <img
              className="relative rounded-341xl w-5 h-5 overflow-hidden shrink-0 object-cover"
              alt=""
              src="/imgcard@2x.png"
            />
            <div className="relative">EN</div>
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
              alt=""
              src="/chevrondown@2x.png"
            />
          </div>
        </div>
      </div>
      {/* Header ends */}
      <div className="self-stretch bg-true-white overflow-hidden flex flex-col items-start justify-start text-gray-200">
        <div className="self-stretch bg-true-white overflow-hidden flex flex-row items-start justify-start gap-[20px]">
          {/* side filter starts */}
          <div className="self-stretch bg-gray-200 box-border w-[200px] overflow-hidden shrink-0 flex flex-col items-center justify-start py-5 px-[50px] border-[1px] border-solid border-grey-300">
            <div className="relative w-[154px] h-[568px]">
              <div className="absolute top-[524px] left-[0px] rounded-lg bg-darkslategray-100 overflow-hidden flex flex-row items-center justify-center p-2 text-true-white border-[1px] border-solid border-lavender">
                <div className="relative">Search</div>
              </div>
              <div className="absolute top-[0px] left-[0px] w-[124px] h-[74px]">
                <div className="absolute top-[38px] left-[0px] bg-true-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px]">
                  <div className="relative">Moscow</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown@2x.png"
                  />
                </div>
                <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center text-true-white">
                  <div className="relative">Where</div>
                </div>
              </div>
              <div className="absolute top-[104px] left-[0px] w-[154px] h-[78px] text-true-white">
                <div className="absolute top-[0px] left-[0px] flex flex-row items-center justify-center">
                  <div className="relative">When</div>
                </div>
                <div className="absolute top-[38px] left-[0px] bg-true-white flex flex-row items-center justify-start p-1 gap-[8px] text-gray-200">
                  <img
                    className="relative rounded w-8 h-8 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/32--calendar-with-dates@2x.png"
                  />
                  <div className="relative">Choose</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown@2x.png"
                  />
                </div>
              </div>
              <div className="absolute top-[212px] left-[0px] w-[90px] h-[74px]">
                <div className="absolute top-[38px] left-[0px] bg-true-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px]">
                  <div className="relative">Hotel</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown@2x.png"
                  />
                </div>
                <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center text-true-white">
                  <div className="relative">Type</div>
                </div>
              </div>
              <div className="absolute top-[316px] left-[0px] w-[129px] h-[74px]">
                <div className="absolute top-[38px] left-[0px] bg-true-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px]">
                  <div className="relative">Standard</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown@2x.png"
                  />
                </div>
                <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center text-true-white">
                  <div className="relative">Room</div>
                </div>
              </div>
              <div className="absolute top-[420px] left-[0px] w-[105px] h-[74px]">
                <div className="absolute top-[38px] left-[0px] bg-true-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px]">
                  <div className="relative">1 adult</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown@2x.png"
                  />
                </div>
                <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center text-true-white">
                  <div className="relative">Adults</div>
                </div>
              </div>
            </div>
          </div>
          {/* side filter ends */}

          <div className="flex-1 bg-true-white overflow-hidden flex flex-col items-start justify-start gap-[40px] text-lg text-grey-600 font-body-large">
            {/* menu filter starts */}
            <div className="self-stretch rounded-md bg-gray-200 overflow-hidden flex flex-row items-end justify-between py-5 px-[50px] text-5xl text-gray-200 font-roboto border-[1px] border-solid border-lavender">
              <div className="relative w-[124px] h-[74px]">
                <div className="absolute top-[38px] left-[0px] bg-true-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px]">
                  <div className="relative">Moscow</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown@2x.png"
                  />
                </div>
                <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center text-true-white">
                  <div className="relative">Where</div>
                </div>
              </div>
              <div className="relative w-[154px] h-[78px] text-true-white">
                <div className="absolute top-[0px] left-[0px] flex flex-row items-center justify-center">
                  <div className="relative">When</div>
                </div>
                <div className="absolute top-[38px] left-[0px] bg-true-white flex flex-row items-center justify-start p-1 gap-[8px] text-gray-200">
                  <img
                    className="relative rounded w-8 h-8 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/32--calendar-with-dates@2x.png"
                  />
                  <div className="relative">Choose</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown1@2x.png"
                  />
                </div>
              </div>
              <div className="relative w-[90px] h-[74px]">
                <div className="absolute top-[38px] left-[0px] bg-true-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px]">
                  <div className="relative">Hotel</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown2@2x.png"
                  />
                </div>
                <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center text-true-white">
                  <div className="relative">Type</div>
                </div>
              </div>
              <div className="relative w-[129px] h-[74px]">
                <div className="absolute top-[38px] left-[0px] bg-true-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px]">
                  <div className="relative">Standard</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown3@2x.png"
                  />
                </div>
                <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center text-true-white">
                  <div className="relative">Room</div>
                </div>
              </div>
              <div className="relative w-[105px] h-[74px]">
                <div className="absolute top-[38px] left-[0px] bg-true-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px]">
                  <div className="relative">1 adult</div>
                  <img
                    className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
                    alt=""
                    src="/chevrondown4@2x.png"
                  />
                </div>
                <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center text-true-white">
                  <div className="relative">Adults</div>
                </div>
              </div>
              <div className="rounded-lg bg-darkslategray-100 overflow-hidden flex flex-row items-center justify-center p-2 text-true-white border-[1px] border-solid border-lavender">
                <div className="relative">Search</div>
              </div>
            </div>
            {/* menu filter */}
            {/* listings1 starts*/}
            <div className="self-stretch flex flex-col items-start justify-start py-0 pr-5 pl-0 gap-[40px]">
              <div className="self-stretch flex flex-row items-start justify-start gap-[40px]">
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>New Moscow City,</span>
                        <span className="text-mediumslateblue"> Moscow</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $598
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      China’s most international city
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>The Hermitage,</span>
                        <span className="text-mediumslateblue">
                          {' '}
                          Saint Petersburg
                        </span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $981
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Take a stroll along the famous harbor
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>Hotel Ahbudabi,</span>
                        <span className="text-mediumslateblue"> Dubai</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $633
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Step back in time in the Gion district
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>{`Tsavo East National Park, `}</span>
                        <span className="text-mediumslateblue">Kenya</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $1,000
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Situated in a semi-arid area previously known as the Taru
                      Desert it opened in April 1948. Named after the Tsavo
                      River, Tsavo East National Park is one of the oldest and
                      largest parks in Kenya.
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        Destination name
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $1,000
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      One line description
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch hidden flex-row items-start justify-start gap-[40px]">
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>The Bund,</span>
                        <span className="text-mediumslateblue"> Shanghai</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $598
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      China’s most international city
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>Sydney Opera House,</span>
                        <span className="text-mediumslateblue"> Sydney</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $981
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Take a stroll along the famous harbor
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>Kōdaiji Temple,</span>
                        <span className="text-mediumslateblue"> Kyoto</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $633
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Step back in time in the Gion district
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>{`Tsavo East National Park, `}</span>
                        <span className="text-mediumslateblue">Kenya</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $1,248
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Named after the Tsavo River, and opened in April 1984,
                      Tsavo East National Park is one of the oldest parks in
                      Kenya. It is located in the semi-arid Taru Desert.
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        Destination name
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $1,000
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      One line description
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* listings1 ends*/}
            {/* listings2 starts*/}
            <div className="self-stretch flex flex-col items-start justify-start gap-[40px]">
              <div className="self-stretch flex flex-row items-start justify-start py-0 pr-5 pl-0 gap-[40px]">
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>New Moscow City,</span>
                        <span className="text-mediumslateblue"> Moscow</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $598
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      China’s most international city
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>The Hermitage,</span>
                        <span className="text-mediumslateblue">
                          {' '}
                          Saint Petersburg
                        </span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $981
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Take a stroll along the famous harbor
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>Hotel Ahbudabi,</span>
                        <span className="text-mediumslateblue"> Dubai</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $633
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Step back in time in the Gion district
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>{`Tsavo East National Park, `}</span>
                        <span className="text-mediumslateblue">Kenya</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $1,000
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Situated in a semi-arid area previously known as the Taru
                      Desert it opened in April 1948. Named after the Tsavo
                      River, Tsavo East National Park is one of the oldest and
                      largest parks in Kenya.
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        Destination name
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $1,000
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      One line description
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch hidden flex-row items-start justify-start gap-[40px]">
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>The Bund,</span>
                        <span className="text-mediumslateblue"> Shanghai</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $598
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      China’s most international city
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>Sydney Opera House,</span>
                        <span className="text-mediumslateblue"> Sydney</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $981
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Take a stroll along the famous harbor
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>Kōdaiji Temple,</span>
                        <span className="text-mediumslateblue"> Kyoto</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $633
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Step back in time in the Gion district
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        <span>{`Tsavo East National Park, `}</span>
                        <span className="text-mediumslateblue">Kenya</span>
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $1,248
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      Named after the Tsavo River, and opened in April 1984,
                      Tsavo East National Park is one of the oldest parks in
                      Kenya. It is located in the semi-arid Taru Desert.
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 rounded-xl bg-true-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden hidden flex-col items-start justify-start">
                  <img
                    className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
                    alt=""
                    src="/image@2x.png"
                  />
                  <div className="self-stretch bg-true-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
                    <div className="self-stretch flex flex-row items-start justify-start">
                      <div className="flex-1 relative font-semibold">
                        Destination name
                      </div>
                      <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
                        $1,000
                      </div>
                    </div>
                    <div className="self-stretch relative text-base text-grey-400">
                      One line description
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* listings2 ends*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageContainer;
