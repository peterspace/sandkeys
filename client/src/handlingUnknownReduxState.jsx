import React, {useState, useEffect}from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";

import {
    FILTER_PRODUCTS,
    selectFilteredPoducts,
  } from "../../../redux/features/product/filterSlice";

export default function HandlingUnknownReduxState (){


      const filteredProducts = useSelector(selectFilteredPoducts);
      const[isReady, setIsReady] = useState(false)

       useEffect(()=>{
            if(filteredProducts.length>=1){
              setIsReady(true)
            }
          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [isReady])

          const shortenText = (text, n) => {
            if (text.length > n) {
              const shortenedText = text.substring(0, n).concat("...");
              return shortenedText;
            }
            return text;
          };
     
  return (
    <div>
         <>
                  {
                    isReady &&
                    <>
                    <table>
                    <thead>
                      <tr>
                        <th>s/n</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Action</th>
                      </tr>
                    </thead>
      
                    <tbody>
                      {filteredProducts.length>=1 && filteredProducts?.map((product, index) => {
                        const { _id, name, category, price, quantity } = product;
                        return (
                          <tr key={_id}>
                            <td>{index + 1}</td>
                            <td>{shortenText(name, 16)}</td>
                            <td>{category}</td>
                            <td>
                              {"$"}
                              {price}
                            </td>
                            <td>{quantity}</td>
                            <td>
                              {"$"}
                              {price * quantity}
                            </td>
                            <td className="icons">
                              <span>
                                <Link to={`/product-detail/${_id}`}>
                                  <AiOutlineEye size={25} color={"purple"} />
                                </Link>
                              </span>
                              <span>
                                <Link to={`/edit-product/${_id}`}>
                                  <FaEdit size={20} color={"green"} />
                                </Link>
                              </span>
                              {/* <span>
                                <FaTrashAlt
                                  size={20}
                                  color={"red"}
                                  onClick={() => confirmDelete(_id)}
                                />
                              </span> */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                    </>
                  }
                  </>
    </div>
  )
}
