import { AuthForm } from "@/components/auth/auth-form"
import { InfoSection } from "@/components/auth/info-section"
import { Leaf } from "lucide-react"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Educational Content / Info Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-teal-200/40 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 h-full">
          <InfoSection />
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12 bg-background">
        {/* Mobile Logo (shown only on mobile) */}
        <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">SafeDispose</span>
        </div>

        <AuthForm />

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>By continuing, you agree to our mission of combating antimicrobial resistance.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-primary">Terms of Service</a>
            {" • "}
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            {" • "}
            <a href="#" className="hover:text-primary">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  )
}
