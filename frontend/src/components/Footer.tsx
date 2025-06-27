export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl">🌦️</span>
                            <span className="text-xl font-bold">Weather Event Notifier</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Stay ahead of the news with personalized weather alerts delivered punctually.
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer">
                                <span>📧</span>
                            </div>
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer">
                                <span>📱</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#features" className="hover:text-white">Features</a></li>
                            <li><a href="#about" className="hover:text-white">About</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Weather Notifier built by CodeCollab UMass</p>
                </div>
            </div>
        </footer>
    )
}