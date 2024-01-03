import { useMemo } from 'react';

const MenuButton = ({ title, menuButtonBorder, handleclick }) => {
  const menuButtonStyle = useMemo(() => {
    return {
      border: menuButtonBorder,
    };
  }, [menuButtonBorder]);

  return (
    <div
      className="cursor-pointer overflow-hidden flex flex-row items-start justify-start p-1 text-left text-[24px] text-silver font-roboto"
      style={menuButtonStyle}
      onClick={handleclick}
    >
      <div className="relative">{title}</div>
    </div>
  );
};

export default MenuButton;
