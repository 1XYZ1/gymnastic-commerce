interface ProductImageCellProps {
  src: string;
  alt: string;
}

export const ProductImageCell = ({ src, alt }: ProductImageCellProps) => {
  return (
    <div className="w-20 h-20 overflow-hidden rounded-md">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};
