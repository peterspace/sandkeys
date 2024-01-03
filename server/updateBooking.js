// import { booking } from './bookingInfo.js';

const bookingL = localStorage.getItem('booking')
  ? JSON.parse(localStorage.getItem('booking'))
  : null;

const confirmationNumber = document.querySelector('.confirmation-number');
const roomPhoto = document.querySelector('#room-photo');
const username = document.querySelector('#username');
const propertyName = document.querySelector('#property-name');
const propertyAddress = document.querySelector('#property-address');
const reservation = document.querySelector('#reservation');
const checkIn = document.querySelector('#check-in');
const checkOut = document.querySelector('#check-out');
const deposit = document.querySelector('#deposit');
const balance = document.querySelector('#balance');
const total = document.querySelector('#total');
const propertyExpecting = document.querySelector('#property-expecting');
const balanceInfo = document.querySelector('#balance-info');

function updateBooking(booking) {
  const confirmationNumberB = `Confirmation number: 302899875`;
  const roomPhotoB = booking?.room?.photos[0]; // first photo by index
  const usernameB = `Thanks ${booking?.name}!`;
  const propertyNameB = booking?.room?.title;
  const propertyAddressB = `${booking?.room?.address}, ${booking?.room?.city}`;
  const reservationB = `${booking?.numberOfNights} night, ${booking?.room?.roomType} room`;
  const checkInB = `${booking?.checkIn} ${booking?.year} (from ${booking?.room?.checkIn}:00)`;
  const checkOutB = `${booking?.checkOut} ${booking?.year} (until ${booking?.room?.checkOut}:00)`;
  const depositB = `${0.25 * booking?.totalPrice} RUB`;
  const balanceB = `${0.75 * booking?.totalPrice} RUB`;
  const totalB = `${booking?.totalPrice} RUB`;
  const propertyExpectingB = `${booking?.room?.title} will be expecting you on ${booking?.checkIn}`;
  const balanceInfoB = `The booking balance of ${
    0.75 * booking?.totalPrice
  } RUB will be handled by ${booking?.room?.title}
upon arrival.`;

  // confirmationNumber.innerText = confirmationNumberB;
  // roomPhoto.innerText = roomPhotoB;
  username.innerText = usernameB;
  propertyName.innerText = propertyNameB;
  propertyAddress.innerText = propertyAddressB;
  reservation.innerText = reservationB;
  checkIn.innerText = checkInB;
  checkOut.innerText = checkOutB;
  deposit.innerText = depositB;
  balance.innerText = balanceB;
  total.innerText = totalB;
  propertyExpecting.innerText = propertyExpectingB;
  balanceInfo.innerText = balanceInfoB;
}

// updateBooking(booking);

updateBooking(bookingL);

// const newData = () => {
//   localStorage.setItem('booking', JSON.stringify(booking));
// };

// newData();
