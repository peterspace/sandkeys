import { useState, useEffect } from 'react';

import Destination from '../components/Destination.jsx';
import DestinationFeatured from '../components/DestinationFeatured.jsx';
import TypesFeatured from '../components/TypesFeatured.jsx';

export default function IndexPage(props) {
  const { language } = props;
  const [city, setCity] = useState('');

  return (
    <>
      <div className="flex flex-col gap-3 mt-8 w-full">
        <>
          <div className="flex justify-center items-center">
            <DestinationFeatured language={language} />
          </div>
          <div className="flex justify-center items-center">
            <TypesFeatured language={language} />
          </div>

          <div className="flex justify-center items-center bg-black">
            <Destination language={language} />
          </div>
        </>
      </div>
    </>
  );
}
