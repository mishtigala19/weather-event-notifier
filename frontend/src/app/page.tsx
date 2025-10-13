import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import About from "@/components/About";
import SubscriptionForm from '@/components/SubscriptionForm';
import Warmup from '@/components/Warmup';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Client-only warmup */}
            <Warmup />
            <Header />
            <Features />
            <main>
                <Hero />
                <section id="subscribe" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Subscribe for Weather Alerts!
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Stay informed about weather conditions in your area with personalized alerts delivered directly to your inbox or phone.
                            </p>
                        </div>
                        <SubscriptionForm />
                    </div>
                </section>
                <About />
                <section id="faq" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4">
                        <FAQ />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}