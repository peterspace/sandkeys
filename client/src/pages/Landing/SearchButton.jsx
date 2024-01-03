import { useMemo } from 'react';

const SearchButton = ({ searchButtonBackgroundColor, searchButtonBorder }) => {
  const searchButtonStyle = useMemo(() => {
    return {
      backgroundColor: searchButtonBackgroundColor,
      border: searchButtonBorder,
    };
  }, [searchButtonBackgroundColor, searchButtonBorder]);

  return (
    <div
      className="rounded-lg bg-mediumblue overflow-hidden flex flex-row items-center justify-center p-2 text-left text-[24px] text-white font-roboto border-[1px] border-solid border-grey-300"
      style={searchButtonStyle}
    >
      <div className="relative">Search</div>
    </div>
  );
};

export default SearchButton;
