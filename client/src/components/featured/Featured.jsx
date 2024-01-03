import './featured.css';
import { countByCity } from '../../services/apiService';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setCity } from '../../redux/features/auth/bookingSlice';

const Featured = () => {
  const dispatch = useDispatch();
  const [city, updateCity] = useState('moscow');

  const [data, setData] = useState([]);

  useEffect(() => {
    getAllPlaces();
  }, []);

  const getAllPlaces = async () => {
    countByCity().then((response) => {
      setData(response);
    });
  };

  useEffect(() => {
    ChooseCity();
  }, [city]);

  async function ChooseCity() {
    dispatch(
      setCity({
        city: city,
      })
    );
  }

  return (
    <>
      <div className="featured">
        <>
          <div
            className="featuredItem"
            onClick={() => {
              updateCity('moscow');
            }}
          >
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Moscow</h1>
              <h2>{data[0]} properties</h2>
            </div>
          </div>

          <div
            className="featuredItem"
            onClick={() => {
              updateCity('sanit-petersburg');
            }}
          >
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Saint Petersburg</h1>
              <h2>{data[1]} properties</h2>
            </div>
          </div>
          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
              alt=""
              className="featuredImg"
            />
            <div
              className="featuredTitles"
              onClick={() => {
                updateCity('dubai');
              }}
            >
              <h1>Dubai</h1>
              <h2>{data[2]} properties</h2>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default Featured;
