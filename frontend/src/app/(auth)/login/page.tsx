import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),linear-gradient(180deg,#eef4ff_0%,#ffffff_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.02)_25%,transparent_25%,transparent_50%,rgba(15,23,42,0.02)_50%,rgba(15,23,42,0.02)_75%,transparent_75%,transparent)] bg-[length:28px_28px] opacity-30" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1200px] items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)] ring-1 ring-slate-200 lg:min-h-[640px] lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="relative min-h-[320px] overflow-hidden bg-transparent text-white sm:min-h-[360px] lg:min-h-full">
            <img
              aria-hidden
              src="/images/left side image login new-cropped.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110"
              style={{ objectPosition: 'left center' }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(15,23,42,0.08)_60%)] pointer-events-none" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 lg:p-12">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">DevFlx Secure Access</p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-tight sm:text-5xl">Access your workspace with confidence.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
                Protected login, role-based access, and encrypted session handling for every account.
              </p>
            </div>
          </aside>

          <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
