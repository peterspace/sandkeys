import {
  apple,
  mastercard,
  visacard,
  qrcode,
  // usdt,
} from './assets/img/payOptions';

export default function PaymentOptions({ selected, onChange }) {
  function handleCbClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName !== name)]);
    }
  }
  return (
    <>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes('mastercard')}
          name="mastercard"
          onChange={handleCbClick}
        />
       <img src={mastercard} alt="star" className="w-7 h-7 object-contain rounded-lg" />
        <span>MasterCard</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes('visacard')}
          name="visacard"
          onChange={handleCbClick}
        />
        <img src={visacard} alt="star" className="w-10 h-10 object-contain rounded-lg" />
        <span>Visa Card</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes('qrcode')}
          name="qrcode"
          onChange={handleCbClick}
        />
        <img src={qrcode} alt="star" className="w-6 h-6 object-contain rounded-lg" />
        <span>QR Code</span>
      </label>
      {/* <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes('crypto')}
          name="crypto"
          onChange={handleCbClick}
        />
        <img src={usdt} alt="star" className="w-5 h-5 object-contain rounded-lg" />
        <span>USDT</span>
      </label> */}
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes('apple')}
          name="apple"
          onChange={handleCbClick}
        />
        <img src={apple} alt="star" className="w-12 h-12 object-contain rounded-lg" />
        <span>Apple Pay</span>
      </label>
    </>
  );
}
