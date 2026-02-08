import { BsCheck2, BsChevronExpand } from 'react-icons/bs';
import { Dropdown } from 'flowbite-react';

const DropDownBox = ({ item, setItem, options }) => {
  return (
    <Dropdown
      label=""
      dismissOnClick={true}
      renderTrigger={() => (
        <button
          type="button"
          className={
            'flex flex-row justify-center items-center gap-2 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left text-gray-700 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'
          }
        >
          <span className="ms-3 whitespace-nowrap">
            {`${item ? item : `Select`}`}
          </span>
          <div className="text-gray-700">
            <BsChevronExpand />
          </div>
        </button>
      )}
    >
      {options.map((op, index) => (
        <div
          className=""
          key={index}
          onClick={() => setItem(op?.name ? op?.name : op)}
        >
          <Dropdown.Item>{op?.name ? op?.name : op}</Dropdown.Item>
        </div>
      ))}
    </Dropdown>
  );
};

export default DropDownBox;
