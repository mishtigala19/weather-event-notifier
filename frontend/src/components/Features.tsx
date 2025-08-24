export default function Features() {
    const features = [
        {
            icon: "🔧",
            title: "Email and SMS Alerts",
            description: "Choose how you want to receive alert - email for detailed info or SMS for urgent warnings on the go.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: "📍",
            title: "Location-Based",
            description: "Precise weather monitoring based on your location to ensure accuracy.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: "🔄",
            title: "Smart Scheduling",
            description: "Set one-time alerts or recurring notifications for events or planning according to your time.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: "⚡️",
            title: "Real-Time Data",
            description: "Powered by OpenWeatherMap API for accurate and instant weather conditions and forecast.",
            color: "from-orange-500 to-red-500"
        },
    ]

    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <span className="text-2xl">{feature.icon}</span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                            
                            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg">
                        <span className="text-2xl">🎯</span>
                        <span className="text-gray-700 font-medium">Verified and Accurate Alerts</span>
                    </div>
                </div>
            </div>
        </section>
    )
}