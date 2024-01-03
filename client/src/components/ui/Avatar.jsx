const Avatar = ({ src }) => {
  return (
    <img
      className="rounded-full"
      height="30"
      width="30"
      alt="Avatar"
      src={src || '/images/placeholder.jpg'}
    />
  );
};

export default Avatar;
