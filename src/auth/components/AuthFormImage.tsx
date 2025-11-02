import { useImageAnimation } from '@/shared/hooks';
import { cn } from '@/lib/utils';

interface AuthFormImageProps {
  src?: string;
  alt?: string;
}

export const AuthFormImage = ({
  src = '/placeholder.svg',
  alt = 'Authentication illustration',
}: AuthFormImageProps) => {
  const { ref, isVisible } = useImageAnimation({ threshold: 0.1 });

  return (
    <div ref={ref} className="relative hidden bg-muted md:block overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={cn(
          'absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale',
          isVisible ? 'image-fade-in-scale' : 'image-animate-base'
        )}
        loading="lazy"
      />
    </div>
  );
};
