import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Sprout, Target, Heart, Lightbulb, ShieldCheck } from "lucide-react"

const values = [
  { icon: <Target className="w-6 h-6" />, title: "Mission-Driven", desc: "Empowering farmers with technology to modernize agricultural operations." },
  { icon: <Heart className="w-6 h-6" />, title: "Community First", desc: "Building trust between farmers, providers, and buyers through transparency." },
  { icon: <Lightbulb className="w-6 h-6" />, title: "Innovation", desc: "Leveraging cutting-edge tech to solve real-world agricultural challenges." },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Security", desc: "Secure transactions, verified users, and encrypted data at every layer." },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="hero-gradient py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16a34a]/10 border border-[#16a34a]/20 mb-6">
              <Sprout className="w-4 h-4 text-[#16a34a]" />
              <span className="text-sm font-medium text-[#16a34a]">About AgriLink</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">
              Digitally Connecting <span className="gradient-text">Agriculture</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
              AgriLink is a full-stack platform that digitally connects farmers, service providers, and buyers
              to streamline agricultural operations. Built with secure authentication, role-based dashboards,
              and scalable architecture.
            </p>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our <span className="gradient-text">Values</span></h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <Card key={i} className="card-hover border-border/50">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16a34a]/10 to-[#0ea5e9]/10 flex items-center justify-center text-[#16a34a] shrink-0">
                      {v.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{v.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 hero-gradient">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-bold text-center mb-8">How It <span className="gradient-text">Works</span></h2>
            <div className="space-y-6">
              {[
                { step: "1", title: "Farmer Posts Needs", desc: "Farmers post harvest requirements or list crops for sale on the platform." },
                { step: "2", title: "Providers & Buyers Respond", desc: "Service providers accept harvest jobs, buyers send price offers on crops." },
                { step: "3", title: "Match & Confirm", desc: "Farmers review and accept the best offers and providers for their needs." },
                { step: "4", title: "Transparent Transaction", desc: "Payments are tracked, receipts uploaded, and transactions confirmed securely." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#ffffff]">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
