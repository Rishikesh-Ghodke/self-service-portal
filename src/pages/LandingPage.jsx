import { useState } from 'react';
import {
  FilePlus,
  ScrollText,
  Shield,
  LogIn,
  Mail,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../hooks/useAuth';
import { APP_NAME } from '../constants';

const features = [
  {
    icon: FilePlus,
    title: 'Request Access',
    description:
      'Submit IAM role requests for GCP projects with justification and time-bound access windows.',
  },
  {
    icon: ScrollText,
    title: 'Track Requests',
    description:
      'Monitor request status, approvals, and history across your organization in one place.',
  },
  {
    icon: Shield,
    title: 'Access Visibility',
    description:
      'View current access mappings by user and project to understand who has what permissions.',
  },
];

const steps = [
  { icon: LogIn, label: 'Sign In' },
  { icon: FilePlus, label: 'Submit Request' },
  { icon: Mail, label: 'Approval via Email' },
  { icon: CheckCircle2, label: 'Access Updated' },
];

export default function LandingPage() {
  const { signIn, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
      /* LandingRoute redirects authenticated users to role dashboard */
    } catch {
      /* error surfaced via auth context */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-white px-4 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              {APP_NAME}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
              Request and manage IAM access for GCP projects through a secure approval
              workflow.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <GoogleSignInButton
                onClick={handleSignIn}
                loading={loading}
                size="lg"
              />
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="px-4 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-primary-light">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h2 className="text-lg font-semibold text-text">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border bg-white px-4 py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-xl font-semibold text-text sm:text-2xl">
              How It Works
            </h2>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
              {steps.map(({ icon: Icon, label }, index) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center text-center sm:min-w-[120px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <p className="mt-3 text-sm font-medium text-text">{label}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <span
                      className="hidden pb-8 text-lg text-text-muted/40 sm:inline"
                      aria-hidden
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security notice */}
        <section className="px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-4 rounded border border-border bg-white p-5 shadow-sm sm:p-6">
              <div className="shrink-0">
                <Lock className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-text">Security Notice</h2>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  Restricted to authenticated Searce users only. Google Workspace
                  sign-in required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Searce. Internal use only.</p>
        </div>
      </footer>
    </div>
  );
}
