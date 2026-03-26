import Link from "next/link";
import { 
  MessageCircle, 
  Users, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap
} from "lucide-react";

const highlights = [
  {
    icon: MessageCircle,
    title: "WhatsApp Integration",
    description: "Incoming WhatsApp messages automatically become leads in your pipeline.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconBg: "#10b981",
  },
  {
    icon: Users,
    title: "Lead Management",
    description: "Track every prospect from first contact to closed deal with smart stages.",
    gradient: "from-blue-500/20 to-indigo-500/20",
    iconBg: "#3b82f6",
  },
  {
    icon: BarChart3,
    title: "Follow-up Tracking",
    description: "Never miss a follow-up with automated reminders and scheduled nudges.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconBg: "#f59e0b",
  },
];

const benefits = [
  "Unlimited leads & contacts",
  "WhatsApp Business integration",
  "Automated follow-up reminders",
  "Team collaboration",
  "Activity history & notes",
  "Mobile-friendly dashboard",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">LeadCRM</span>
          </div>
          <Link 
            href="/login"
            className="px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-white/60">Now with WhatsApp Business integration</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Turn conversations
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              into customers
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The CRM that brings your WhatsApp leads straight into a 
            powerful pipeline. Track, follow up, and close deals faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login"
              className="group px-8 py-4 bg-white text-[#0a0f1a] rounded-xl font-semibold text-sm 
                         hover:bg-white/90 transition-all duration-200 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 rounded-xl font-medium text-sm text-white/70 hover:text-white 
                         border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-32">
          {highlights.map((feature) => (
            <div 
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] 
                         hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${feature.iconBg}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.iconBg }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Everything you need
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Built for teams that 
              <span className="text-white/40"> close deals on WhatsApp</span>
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              Stop losing leads in chat threads. Every message becomes a trackable 
              lead with automatic follow-up reminders and team collaboration.
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-400 
                         rounded-xl font-medium text-sm hover:bg-emerald-500/15 transition-colors"
            >
              Start managing leads
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div 
                key={benefit}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-16 px-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.06]">
          <h2 className="text-3xl font-bold mb-4">Ready to convert more leads?</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Join teams using LeadCRM to turn WhatsApp conversations into revenue.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0f1a] rounded-xl 
                       font-semibold text-sm hover:bg-white/90 transition-all duration-200"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-sm text-white/30">
            © 2025 LeadCRM. Built for modern sales teams.
          </p>
        </footer>

      </div>
    </div>
  );
}
