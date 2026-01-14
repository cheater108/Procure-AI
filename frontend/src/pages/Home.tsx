import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Zap } from "lucide-react"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Procurement Solutions
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Transform Your Procurement Process with <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">AI</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Automate your RFP process, reduce costs, and make data-driven decisions with our AI-powered procurement platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ProcureAI?</h2>
            <p className="text-muted-foreground">
              Our platform leverages cutting-edge AI to revolutionize your procurement process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Automated RFP Creation",
                description: "Generate comprehensive RFPs in minutes with AI assistance."
              },
              {
                title: "Vendor Matching",
                description: "Find the perfect vendors using our intelligent matching algorithm."
              },
              {
                title: "Real-time Analytics",
                description: "Make data-driven decisions with our comprehensive analytics dashboard."
              },
              {
                title: "Contract Management",
                description: "Streamline your contract lifecycle with automated tracking."
              },
              {
                title: "Cost Optimization",
                description: "Identify cost-saving opportunities with AI-powered insights."
              },
              {
                title: "Secure & Compliant",
                description: "Enterprise-grade security and compliance standards."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background p-6 rounded-lg border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-linear-to-r from-primary/5 to-primary/10 p-8 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your procurement process?</h2>
            <p className="text-muted-foreground mb-6">Join leading companies that trust ProcureAI for their procurement needs.</p>
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
