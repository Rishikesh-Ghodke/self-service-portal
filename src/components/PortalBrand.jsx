import { APP_NAME } from '../constants';

const LOGO_SRC = '/searce-logo.png';

const sizeStyles = {
  md: {
    logo: 'h-7 sm:h-8',
    portal: 'text-base font-semibold text-primary sm:text-lg',
    separator: 'h-6',
    gap: 'gap-3 sm:gap-4',
  },
  lg: {
    logo: 'h-8 sm:h-10',
    portal: 'text-xl font-semibold text-primary sm:text-2xl',
    separator: 'h-7 sm:h-8',
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
      <img
        src={LOGO_SRC}
        alt="Searce"
        className={`w-auto shrink-0 object-contain object-left ${styles.logo}`}
      />
      <span
        className={`w-px shrink-0 bg-border ${styles.separator}`}
        aria-hidden
      />
      <h1 className={`truncate leading-tight ${styles.portal}`}>{APP_NAME}</h1>
    </div>
  );
}
