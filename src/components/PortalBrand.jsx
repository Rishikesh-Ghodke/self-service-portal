import { APP_NAME } from '../constants';

const sizeStyles = {
  md: {
    searce: 'text-lg font-normal tracking-tight text-text sm:text-xl',
    portal: 'text-base font-semibold text-primary sm:text-lg',
    separator: 'text-lg text-text-muted/35 sm:text-xl',
    gap: 'gap-3 sm:gap-4',
  },
  lg: {
    searce: 'text-xl font-normal tracking-tight text-text sm:text-2xl',
    portal: 'text-xl font-semibold text-primary sm:text-2xl',
    separator: 'text-xl text-text-muted/35 sm:text-2xl',
    gap: 'gap-3 sm:gap-4',
  },
};

export default function PortalBrand({
  className = '',
  centered = false,
  size = 'md',
}) {
  const styles = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      className={`flex min-w-0 items-center ${styles.gap} ${
        centered ? 'justify-center' : ''
      } ${className}`}
    >
      <span className={`shrink-0 lowercase ${styles.searce}`}>searce</span>
      <span
        className={`shrink-0 font-light leading-none ${styles.separator}`}
        aria-hidden
      >
        |
      </span>
      <h1 className={`truncate leading-tight ${styles.portal}`}>{APP_NAME}</h1>
    </div>
  );
}
