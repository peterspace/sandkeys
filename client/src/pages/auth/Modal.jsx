import React from 'react';

export default function Modal({ visible, children }) {
  if (!visible) return null;
//   className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black bg-opacity-60 flex justify-center items-center overflow-auto z-[1]" 
  //className="fixed inset-0 backdrop-blur-[1px] bg-overlayBlack flex justify-center items-center overflow-auto z-[1]"
    //className="fixed inset-0 backdrop-blur-[4px] bg-overlayBlack flex justify-center items-center overflow-auto z-[1]"
        //className="fixed inset-0 bg-overlayBlack flex justify-center items-center overflow-auto z-[1]"

  return (
    <div
      id="parent"
      // className="fixed inset-0 backdrop-blur-[1px] bg-overlayBlack flex justify-center items-center overflow-auto z-[1]"
      className="fixed inset-0 bg-overlayBlack flex justify-center items-center overflow-auto z-[1]"
    >
      <div>{children}</div>
    </div>
  );
}
