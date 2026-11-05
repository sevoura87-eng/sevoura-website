import Image, { type ImageProps } from "next/image";

/** next/image that optimises local + Supabase Storage images and passes any other URL through untouched. */
export default function ProductImage(props: ImageProps & { src: string }) {
  const { src, alt, ...rest } = props;
  const optimisable = src.startsWith("/") || /^https:\/\/[a-z0-9-]+\.supabase\.co\//.test(src);
  return <Image src={src} alt={alt} unoptimized={!optimisable} {...rest} />;
}
