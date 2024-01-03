import axios from 'axios';

import { stripeCheckOutSession } from '../../services/apiService';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PayButton = (props) => {
  const { cartItems } = props;
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  const handleCheckout2 = () => {
    // let userData = {
    //   cartItems,
    //   userId: user._id,
    // };
    axios
      .post(`${BACKEND_URL}/payment/create-checkout-session`, {
        userId: user.userId,
        cartItems,
      })
      .then((response) => {
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  const handleCheckout = () => {
    let userData = {
      userId: user.userId,
      cartItems,
    };
    const response = stripeCheckOutSession(userData);
    if (response) {
      window.location.href = response;
    }
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Check out</button>
    </>
  );
};

export default PayButton;
