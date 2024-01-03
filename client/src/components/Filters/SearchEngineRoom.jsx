import React, { useState } from 'react';

const SearchEngineRoom = () => {
  //========={Place}========================
  //   owner
  // title
  // address
  // description
  // perks
  // extraInfo
  // type
  // city
  // rating
  // rooms
  // cheapestPrice
  // isAvailable
  // paymentOptions
  // ratings
  // totalrating

  //========={Rooms}========================
  // title
  // description
  // perks
  // extraInfo
  // checkIn
  // checkOut
  // price
  // type
  // price
  // unavailableDates
  // maxGuests
  // roomNumber
  // isAvailable

    //========={Rooms  perks}========================
  const [data, setData] = useState([
    { title: 'Item 1', category: 'Category A', price: 100 },
    { title: 'Item 2', category: 'Category B', price: 200 },
    { title: 'Item 3', category: 'Category A', price: 150 },
    { title: 'Item 4', category: 'Category C', price: 75 },
  ]);

  // const [filters, setFilters] = useState({
  //   title: '',
  //   category: '',
  //   price: '',
  // });

  const [filters, setFilters] = useState({
    title: '',
    perks: '',
    extraInfo: '',
    price: '',
    type: '',
    price: '',
    unavailableDates: '',
    maxGuests: '',
    roomNumber: '',
    isAvailable: '',
  });

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredData = data.filter((item) => {
    return (
      item.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      (filters.category === '' || item.category === filters.category) &&
      (filters.price === '' || item.price === parseInt(filters.price))
    );
  });

  return (
    <div>
      <form>
        <div>
          <label htmlFor="name">Title:</label>
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            <option value="Category A">Category A</option>
            <option value="Category B">Category B</option>
            <option value="Category C">Category C</option>
          </select>
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            name="price"
            value={filters.price}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.title}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchEngineRoom;
