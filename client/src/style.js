const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading2: "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  paragraph: "font-poppins font-normal text-pIndigo text-[18px] leading-[30.8px]",
  paragraph2: "font-poppins font-normal text-xs text-pIndigo",
  paragraph2Hover: "font-poppins font-normal text-xs text-pIndigo hover:text-gray-200",
  paragraphGreen: "font-poppins font-normal text-xs text-pGreen",
  paragraphDimBlue: "font-poppins font-normal text-xs text-pDimBlue hover:text-gray-200",
  paragraphLightBlue: "font-poppins font-normal text-xs text-pDimBlue hover:text-blue-700",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY}`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

  sectionInfo: `flex-1 ${styles.flexStart} flex-col`,

  // cardInfo: `bg-indigo-light-gradient ${styles.flexCenter} `,
  cardInfo: `bg-indigo-light-gradient ${styles.flexCenter} hover: bg-indigo-mid-gradient `,
  cardWallet: `bg-indigo-light-gradient ${styles.flexCenter} hover: bg-indigo-mid-gradient `,
  cardSideBar: `bg-indigo-mid-gradient ${styles.flexCenter}`,
  cardSideBarItem: `bg-indigo-mid-gradient ${styles.flexCenter} hover: bg-indigo-light-gradient `,
  // cardParagraph: `flex justify-center items-center ${styles.paragraph}`,
};

export default styles;
