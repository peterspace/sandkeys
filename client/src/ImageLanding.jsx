export default function ImageLanding({ src, style, ...rest }) {
  src =
    src && src.includes('https://')
      ? src
      : 'http://localhost:4000/uploads/' + src;
  return <img {...rest} className={style} src={src} alt={''} />;
}
