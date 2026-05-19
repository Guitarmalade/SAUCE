import { signup } from '@/app/auth/actions'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default async function SignupPage(
  props: {
    searchParams: Promise<{ message?: string }>
  }
) {
  const searchParams = await props.searchParams
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative">
      <div className="max-w-md w-full glass-card p-10 rounded-3xl relative z-10">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-amber p-4 rounded-2xl shadow-xl -rotate-3">
          <Sparkles className="w-8 h-8 text-navy" />
        </div>
        
        <div className="pt-4 pb-8">
          <h2 className="text-center text-4xl font-paint text-navy">
            Join SAUCE
          </h2>
          <p className="mt-2 text-center font-medium text-navy/70">
            Start tracking your progress today
          </p>
        </div>
        
        <form className="space-y-6" action={signup}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-navy mb-1.5" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/50 border-2 border-white/60 placeholder-navy/40 text-navy font-medium rounded-xl focus:outline-none focus:ring-0 focus:border-amber focus:bg-white transition-all shadow-sm"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-navy mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/50 border-2 border-white/60 placeholder-navy/40 text-navy font-medium rounded-xl focus:outline-none focus:ring-0 focus:border-amber focus:bg-white transition-all shadow-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/50 border-2 border-white/60 placeholder-navy/40 text-navy font-medium rounded-xl focus:outline-none focus:ring-0 focus:border-amber focus:bg-white transition-all shadow-sm"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-navy mb-1.5" htmlFor="role">
                I am a...
              </label>
              <select
                id="role"
                name="role"
                className="appearance-none relative block w-full px-4 py-3 bg-white/50 border-2 border-white/60 text-navy font-bold rounded-xl focus:outline-none focus:ring-0 focus:border-amber focus:bg-white transition-all shadow-sm cursor-pointer"
                defaultValue="STUDENT"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
          </div>

          {searchParams?.message && (
            <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
              <p className="text-center text-sm font-bold text-red-600">
                {searchParams.message}
              </p>
            </div>
          )}

          <div className="pt-2">
            <button type="submit" className="w-full btn-primary">
              Create Account
            </button>
          </div>
          
          <div className="text-center pt-4 border-t border-navy/5 mt-6">
            <p className="text-sm font-medium text-navy/70">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-amber hover:text-amber-600 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
