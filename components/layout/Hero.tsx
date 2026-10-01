import { HTMLAttributes, ReactNode, ElementType } from 'react';
import { Container } from '@/components/ui/Container';

export interface HeroProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'split' | 'centered' | 'banner';
  image?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  accent?: ReactNode;
  backgroundVariant?: 'sand' | 'sage' | 'dusk' | 'terracotta';
  as?: ElementType;
}

export function Hero({
  variant = 'split',
  image,
  eyebrow,
  title,
  description,
  actions,
  accent,
  backgroundVariant = 'sand',
  className = '',
  ...props
}: HeroProps) {
  const bgStyles = {
    sand: 'bg-[#F9F6F0] text-[#1E1C1A]',
    sage: 'bg-[#4D5844] text-white',
    dusk: 'bg-[#1E1C1A] text-white',
    terracotta: 'bg-[#B85233] text-white',
  }[backgroundVariant];

  if (variant === 'centered') {
    return (
      <section className={`py-16 sm:py-24 lg:py-32 ${bgStyles} ${className}`} {...props}>
        <Container size="narrow">
          <div className="flex flex-col items-center text-center space-y-6">
            {eyebrow && <div>{eyebrow}</div>}
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15]">
              {title}
            </h1>
            {description && (
              <p className="font-sans text-base sm:text-lg text-[#6B655B] max-w-xl leading-relaxed">
                {description}
              </p>
            )}
            {accent && <div>{accent}</div>}
            {actions && <div className="flex flex-wrap justify-center gap-4 pt-2">{actions}</div>}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={`py-12 sm:py-16 lg:py-20 overflow-hidden ${bgStyles} ${className}`} {...props}>
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Area (if split and image present) */}
          {image && (
            <div className="lg:col-span-6 order-2 lg:order-1 relative flex items-center justify-center">
              {image}
            </div>
          )}

          {/* Text Content Area */}
          <div
            className={`${
              image ? 'lg:col-span-6 order-1 lg:order-2' : 'lg:col-span-10 mx-auto text-center'
            } space-y-6`}
          >
            {eyebrow && <div>{eyebrow}</div>}
            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight leading-[1.15]">
              {title}
            </h1>
            {description && (
              <p className="font-sans text-base sm:text-lg opacity-85 leading-relaxed max-w-xl">
                {description}
              </p>
            )}
            {accent && <div>{accent}</div>}
            {actions && <div className="flex flex-wrap items-center gap-4 pt-2">{actions}</div>}
          </div>
        </div>
      </Container>
    </section>
  );
}
