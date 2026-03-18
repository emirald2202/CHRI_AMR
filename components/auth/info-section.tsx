"use client"

import { Droplets, Shield, MapPin, Award, TrendingUp, Users, Building2, Leaf } from "lucide-react"

const stats = [
  { value: "12,000+", label: "Antibiotics Safely Disposed", icon: Shield },
  { value: "300+", label: "Participating Pharmacies", icon: Building2 },
  { value: "50,000+", label: "Liters of Water Protected", icon: Droplets },
  { value: "8,500+", label: "Active Users", icon: Users },
]

const features = [
  {
    icon: MapPin,
    title: "Find Nearby Pharmacies",
    description: "Locate participating pharmacies and disposal centers near you with our interactive map.",
  },
  {
    icon: Award,
    title: "Earn Rewards",
    description: "Get points and badges for every safe disposal. Climb the leaderboard and become an AMR Defender!",
  },
  {
    icon: TrendingUp,
    title: "Track Your Impact",
    description: "See how your contributions help protect the environment and combat antimicrobial resistance.",
  },
]

export function InfoSection() {
  return (
    <div className="flex flex-col h-full px-8 lg:px-12 py-8">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <span className="font-bold text-xl text-emerald-800">SafeDispose</span>
      </div>

      {/* Hero Content */}
      <div className="mb-8 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit">
          <Shield className="h-4 w-4" />
          Fighting Antimicrobial Resistance
        </div>
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-900 mb-4 leading-tight text-balance">
          Dispose Safely.
          <br />
          <span className="text-emerald-600">Protect Tomorrow.</span>
        </h1>
        <p className="text-lg text-emerald-800/80 max-w-lg leading-relaxed">
          Improper disposal of antibiotics contributes to one of the world&apos;s most serious health threats — antimicrobial resistance. Join our mission to make safe disposal easy and rewarding.
        </p>
      </div>

      {/* Why It Matters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-8 border border-emerald-200">
        <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-emerald-600" />
          Why Safe Disposal Matters
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            Antibiotics in water systems accelerate drug-resistant bacteria
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            700,000+ deaths annually due to antimicrobial resistance
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            Improper disposal contaminates soil and drinking water
          </li>
        </ul>
      </div>

      {/* Features */}
      <div className="grid gap-4 mb-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="flex items-start gap-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-emerald-100 hover:bg-white/70 transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <feature.icon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-medium text-emerald-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-emerald-700">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-emerald-100"
          >
            <stat.icon className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
            <div className="text-xl lg:text-2xl font-bold text-emerald-900">{stat.value}</div>
            <div className="text-xs text-emerald-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
