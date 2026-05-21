import { APP_NAME } from '../constants';

const LOGO_SRC = '/searce-logo.png';

export default function LandingHeader() {
  return (
    <header className="border-b border-border bg-white">
      <div className="flex h-14 items-center px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <img
            src={LOGO_SRC}
            alt="Searce"
            className="h-[26px] w-auto shrink-0 object-contain object-left sm:h-7"
          />
          <span
            className="mx-0.5 shrink-0 text-sm font-light leading-none text-text-muted/40 sm:text-base"
            aria-hidden
          >
            |
          </span>
          <span className="truncate text-[15px] font-semibold leading-none text-primary sm:text-base">
            {APP_NAME}
          </span>
        </div>
      </div>
    </header>
  );
}
