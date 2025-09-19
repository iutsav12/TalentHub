import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularNav } from "@/components/circular-nav"
import { DatabaseStatus } from "@/components/database-status"
import { Briefcase, Users, ClipboardList, ArrowRight, Zap, Shield, Sparkles, TrendingUp, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <CircularNav />

      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />

        {/* Enhanced floating orbs with more variety */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-lg animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 mb-8 animate-slide-in hover:scale-105 transition-transform duration-300">
            <Sparkles size={16} className="text-indigo-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-300">Industry-Leading Recruitment Platform</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-balance animate-slide-in bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 cursor-default">
            TalentHub
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-4xl mx-auto leading-relaxed hover:text-foreground/80 transition-colors duration-300">
            Transform your recruitment process with our premium job management platform featuring advanced candidate
            tracking, intelligent assessments, and seamless workflows designed for modern HR teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-7 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 group"
            >
              <Link href="/jobs">
                Get Started{" "}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-10 py-7 glass-card border-white/20 hover:bg-white/5 transition-all duration-300 bg-transparent hover:scale-105 hover:border-primary/30"
            >
              <Link href="/candidates">View Candidates</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default">
              Powerful Features for Modern Recruitment
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto hover:text-foreground/80 transition-colors duration-300">
              Everything you need to streamline your hiring process and find the perfect candidates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group glass-card border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <img src="/modern-office-workspace-with-computers-and-recruit.jpg" alt="Job Management" className="w-full h-full object-cover" />
              </div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Briefcase className="text-indigo-400 group-hover:animate-bounce" size={28} />
                </div>
                <CardTitle className="text-2xl mb-3 group-hover:text-indigo-300 transition-colors duration-300">
                  Job Management
                </CardTitle>
                <CardDescription className="text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  Create, edit, and organize jobs with intuitive drag-and-drop reordering, advanced filtering, and deep
                  linking capabilities for seamless workflow management.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full group-hover:bg-indigo-500/10 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/jobs">
                    Explore Jobs{" "}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group glass-card border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <img src="/diverse-team-of-professionals-in-modern-office-dis.jpg" alt="Candidate Tracking" className="w-full h-full object-cover" />
              </div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Users className="text-purple-400 group-hover:animate-bounce" size={28} />
                </div>
                <CardTitle className="text-2xl mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  Candidate Tracking
                </CardTitle>
                <CardDescription className="text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  Efficiently manage 1000+ candidates with virtualized lists, interactive kanban boards, and detailed
                  progress tracking with collaborative @mentions support.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full group-hover:bg-purple-500/10 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/candidates">
                    View Candidates{" "}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group glass-card border-white/10 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <img src="/digital-assessment-interface-with-charts-and-analy.jpg" alt="Smart Assessments" className="w-full h-full object-cover" />
              </div>
              <CardHeader className="pb-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <ClipboardList className="text-emerald-400 group-hover:animate-bounce" size={28} />
                </div>
                <CardTitle className="text-2xl mb-3 group-hover:text-emerald-300 transition-colors duration-300">
                  Smart Assessments
                </CardTitle>
                <CardDescription className="text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  Build comprehensive assessments with multiple question types, real-time preview, and shareable links
                  with intelligent automated scoring and analytics.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full group-hover:bg-emerald-500/10 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/assessments">
                    Create Assessment{" "}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Growing Teams</h2>
            <p className="text-xl text-muted-foreground">Join thousands of companies streamlining their recruitment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 group">
              <div className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-lg font-medium text-muted-foreground">Candidates Managed</div>
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
            </div>
            <div className="space-y-4 group">
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                25+
              </div>
              <div className="text-lg font-medium text-muted-foreground">Active Jobs</div>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
            </div>
            <div className="space-y-4 group">
              <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                3+
              </div>
              <div className="text-lg font-medium text-muted-foreground">Assessment Types</div>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default">
              Why Choose TalentHub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto hover:text-foreground/80 transition-colors duration-300">
              Built for modern HR teams who demand excellence in every aspect of recruitment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6 group cursor-default">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Zap className="text-indigo-400 group-hover:animate-pulse" size={36} />
              </div>
              <h3 className="text-2xl font-bold group-hover:text-indigo-300 transition-colors duration-300">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                Optimized performance with advanced virtualization and intelligent caching for handling thousands of
                records seamlessly without compromising speed.
              </p>
            </div>

            <div className="text-center space-y-6 group cursor-default">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Shield className="text-purple-400 group-hover:animate-pulse" size={36} />
              </div>
              <h3 className="text-2xl font-bold group-hover:text-purple-300 transition-colors duration-300">
                Secure & Reliable
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                Enterprise-grade security with local data persistence using IndexedDB ensures your sensitive recruitment
                data is always protected and available.
              </p>
            </div>

            <div className="text-center space-y-6 group cursor-default">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <TrendingUp className="text-emerald-400 group-hover:animate-pulse" size={36} />
              </div>
              <h3 className="text-2xl font-bold group-hover:text-emerald-300 transition-colors duration-300">
                Analytics Ready
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                Comprehensive tracking and advanced reporting capabilities to measure recruitment success, optimize
                workflows, and make data-driven hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default">
              System Status
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-time monitoring of platform performance and data integrity
            </p>
          </div>
          <div className="flex justify-center">
            <div className="glass-card p-8 rounded-2xl border-white/10">
              <DatabaseStatus />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 border-t border-white/10 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="text-indigo-400" size={20} />
              <span className="text-lg font-semibold">TalentHub</span>
            </div>
            <p className="text-muted-foreground text-lg">
              © 2024 TalentHub. Built with Next.js and cutting-edge web technologies for the modern workforce.
            </p>
            <div className="flex justify-center gap-8 pt-4">
              <span className="text-sm text-muted-foreground hover:text-indigo-400 transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="text-sm text-muted-foreground hover:text-indigo-400 transition-colors cursor-pointer">
                Terms
              </span>
              <span className="text-sm text-muted-foreground hover:text-indigo-400 transition-colors cursor-pointer">
                Support
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
