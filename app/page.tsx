import { Suspense } from "react"
import Hero from "./components/Hero"
import Features from "./components/Features"
import AISection from "./components/AISection"
import VercelSection from "./components/VercelSection"
import OpsSection from "./components/OpsSection"
import Footer from "./components/Footer"
import Navigation from "./components/Navigation"
import LoadingSpinner from "./components/LoadingSpinner"
import VisitorGate from "./components/VisitorGate"
import ScrollProgress from "./components/ScrollProgress"
import MarqueeBand from "./components/MarqueeBand"

export default function Home() {
  return (
    <VisitorGate>
      <main className="min-h-screen bg-white text-black overflow-hidden">
        <ScrollProgress />
        <Navigation />
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
          <Features />
          <AISection />
          <VercelSection />
          <OpsSection />
          <MarqueeBand />
          <Footer />
        </Suspense>
      </main>
    </VisitorGate>
  )
}
