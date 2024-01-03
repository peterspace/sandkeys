import React from 'react';
import { AiOutlineSearch, AiOutlineCloseCircle } from 'react-icons/ai';

const SearchInput = ({ placeholder, icon, value, setValue, styles }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const clearInput = () => setValue('');

  return (
    <div className={`flex w-full md:w-1/3 items-center ${styles}`}>
      {icon}

      <input
        value={value}
        onChange={(e) => handleChange(e)}
        type="text"
        className="w-full md:w-64 p-2 outline-none bg-transparent text-base"
        placeholder={placeholder}
      />

      <AiOutlineCloseCircle
        className="hidden md:flex text-gray-600 text-xl cursor-pointer"
        onClick={clearInput}
      />
    </div>
  );
};

const SearchHeader = ({
  handleClick,
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
}) => {
  return (
    <div className="bg-primary">
      <div className={`container mx-auto px-5 flex items-center relative`}>
        <div className="w-full z-10">
          <form className="flex items-center">
            <label htmlFor="default-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-gray-800 dark:text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="default-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Job title, keywords, employer"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleClick}
            >
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              Search
            </button>
          </form>

          {/* Earlier search menu */}
          {/* <div className="w-full flex items-center justify-around bg-white px-2 md:px-5 py-2.5 md:py-6 shadow-2xl rounded">
            <SearchInput
              placeholder="Job Title or Keywords"
              icon={<AiOutlineSearch className="text-gray-600 text-xl" />}
              value={searchQuery}
              setValue={setSearchQuery}
            />
            <SearchInput
              placeholder="Add Country or City"
              icon={<CiLocationOn className="text-gray-600 text-xl" />}
              value={location}
              setValue={setLocation}
              styles={'hidden md:flex'}
            />

            <div>
              <CustomButton
                onClick={handleClick}
                title="Search"
                containerStyles={
                  'text-white py-2 md:py3 px-3 md:px-10 focus:outline-none bg-blue-600 rounded-full md:rounded-md text-sm md:text-base'
                }
              />
            </div>
          </div> */}
          {/* ====================={needed}========================= */}
          {/* {type && (
            <div className="w-full lg:1/2 flex flex-wrap gap-3 md:gap-6 py-10 md:py-14">
              {popularSearch.map((search, index) => (
                <span
                  key={index}
                  className="bg-[#1d4fd826] text-[#1d4ed8] py-1 px-2 rounded-full text-sm md:text-base"
                >
                  {search}
                </span>
              ))}
            </div>
          )} */}
        </div>

        <div className="w-1/3 h-full absolute top-24 md:-top-6 lg:-top-14 right-16 2xl:right-[18rem]">
          {/* <img src={HeroImage} className="object-contain" /> */}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
