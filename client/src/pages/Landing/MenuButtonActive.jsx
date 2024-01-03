import { useMemo } from 'react';

const MenuButtonActive = ({ title, menuButtonBorder, handleclick }) => {
  const menuButtonStyle = useMemo(() => {
    return {
      border: menuButtonBorder,
    };
  }, [menuButtonBorder]);

  return (
    <div
      className="cursor-pointer rounded-lg bg-gray-100 text-gray-900 overflow-hidden flex flex-row items-start justify-start p-1 text-left text-[24px] font-roboto"
      style={menuButtonStyle}
      onClick={handleclick}
    >
      <div className="relative">{title}</div>
    </div>
  );
};

export default MenuButtonActive;
