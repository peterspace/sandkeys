export default function Image({ src, ...rest }) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  src = src && src.includes('https://') ? src : `${BACKEND_URL}/uploads/${src}`;
  return <img {...rest} src={src} alt={''} />;
}

//'http://localhost:4000/uploads/'+src;
