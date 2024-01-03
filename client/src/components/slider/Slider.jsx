import ImageSlider from './ImageSlider';
const Slider = ({ slides }) => {
  // const slides = [
  //   { url: "http://localhost:3000/image-1.jpg", title: "beach" },
  //   { url: "http://localhost:3000/image-2.jpg", title: "boat" },
  //   { url: "http://localhost:3000/image-3.jpg", title: "forest" },
  //   { url: "http://localhost:3000/image-4.jpg", title: "city" },
  //   { url: "http://localhost:3000/image-5.jpg", title: "italy" },
  // ];
  // const containerStyles = {
  //   width: '500px',
  //   height: '280px',
  //   margin: '0 auto',
  // };
  return (
    <div className="flex flex-col gap-2 justify-center item-center">
      <h1 className='flex justify-center item-center'>Explore endless comfort at Crib.com</h1>
      <div className="h-[460px] w-[1000px]">
        <ImageSlider slides={slides} />
      </div>
    </div>
  );
};

export default Slider;

// return (
//   <div>
//     <h1>Explore endless comfort at Crib.com</h1>

//     <div style={containerStyles} className="border-gray-50 border-[1px] shadow rounded-xl">
//       <ImageSlider slides={slides} />
//     </div>
//   </div>
// );
