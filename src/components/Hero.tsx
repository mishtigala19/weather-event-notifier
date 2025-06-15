export default function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 overflow-hidden">
            {/* Animated elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animated-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg animated-bounce"></div>
                    <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-300/30 rounded-full blur-md animated-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 text-center">
                    <div className="mb-8">
                        <span className="text-6xl mb-4 block animate-bounce">🌦️</span>
                    </div>
                

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                        Never Miss Important Weather Updates!
                    </h1>

                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                        Get personal weather alerts delivered straight to your device.
                        From light rain to flood storms!
                    </p>
                

                <div className="mt-12 flex justify-center items-center space-x-8 text-blue-200">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl animate-spin">✨</span>
                        <span>Free subscription</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl animate-ping">⚡</span>
                        <span>Real-time Instant alerts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl animate-pulse">🔒</span>
                        <span>Secured info</span>
                    </div>
                </div>
            </div>
        </section>
    )
}