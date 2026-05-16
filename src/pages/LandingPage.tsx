import { Button } from '@blinkdotnew/ui'
import { Building2, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react'
import { blink } from '../blink/client'

export function LandingPage() {
  const handleLogin = () => {
    blink.auth.login()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            <span>Receipt Maker</span>
          </div>
          <Button onClick={handleLogin}>Sign In</Button>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                Professional Bank Receipts <br />
                <span className="text-primary text-opacity-80">Generated in Seconds</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Effortlessly create realistic bank transfer receipts for any country. Choose a bank, enter details, and send digital receipts to your teammates instantly.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" onClick={handleLogin} className="gap-2">
                  Get Started for Free <ArrowRight className="h-4 w-4" />
                </Button>
                <a href="#features" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard 
                icon={<Globe className="h-8 w-8 text-primary" />}
                title="Global Support"
                description="Supports banks and currencies from virtually every country in the world."
              />
              <FeatureCard 
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="Instant Generation"
                description="Auto-fetch details and generate professional receipts in under 30 seconds."
              />
              <FeatureCard 
                icon={<ShieldCheck className="h-8 w-8 text-primary" />}
                title="Realistic Design"
                description="Receipts are designed to match authentic bank transfer documents perfectly."
              />
              <FeatureCard 
                icon={<ArrowRight className="h-8 w-8 text-primary" />}
                title="Easy Sharing"
                description="Share links or download PDFs to send receipts to your team instantly."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Receipt Maker</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2026 Global Bank Receipt Maker. For internal team use only.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border shadow-sm transition-transform hover:-translate-y-1">
      <div className="mb-4 p-3 rounded-xl bg-primary/5">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
