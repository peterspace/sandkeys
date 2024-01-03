import Image from './Image.jsx';

export default function RoomImg({ room, index = 0, className = null }) {
  if (!room?.photos?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover';
  }
  return <Image className={className} src={room?.photos[index]} alt="" />;
}
