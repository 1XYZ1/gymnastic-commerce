interface AuthFormImageProps {
  src?: string;
  alt?: string;
}

export const AuthFormImage = ({
  src = '/placeholder.svg',
  alt = 'Authentication illustration',
}: AuthFormImageProps) => {
  return (
    <div className="relative hidden bg-muted md:block">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  );
};
