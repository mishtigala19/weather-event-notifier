import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header />
            <Features />
            <main> 
                <Hero />
                <section id="subscribe" className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Subscribe for weather alerts!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Subscription form here:
                        </p>
                        <div className="bg-gray-100 rounded-lg p-8 border-2 border-dashed border-gray-300">
                            <p className="text-gray-500">Subscription Form info here...</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}