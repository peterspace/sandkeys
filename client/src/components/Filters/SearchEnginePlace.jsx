import React, { useState } from 'react';

const SearchEnginePlace = () => {
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

  const [data, setData] = useState([
    { name: 'Item 1', category: 'Category A', price: 100 },
    { name: 'Item 2', category: 'Category B', price: 200 },
    { name: 'Item 3', category: 'Category A', price: 150 },
    { name: 'Item 4', category: 'Category C', price: 75 },
  ]);

  // const [filters, setFilters] = useState({
  //   name: '',
  //   category: '',
  //   price: '',
  // });

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    price: '',
  });

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredData = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (filters.category === '' || item.category === filters.category) &&
      (filters.price === '' || item.price === parseInt(filters.price))
    );
  });

  return (
    <div>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={filters.name}
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
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.name}>
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

export default SearchEnginePlace;
