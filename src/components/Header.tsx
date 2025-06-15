export default function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <nav className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🌦️</span>
                        <span className="text-xl font-bold text-gray-900">Weather Event Notifier</span>
                    </div>
                    <div className="hidden md:flex space-x-6">
                        <a href="#home" className="text-gray-600 hover:text-blue-600">Home</a>
                        <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
                        <a href="#subscribe" className="text-gray-600 hover:text-blue-600">Subscribe</a>
                        <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
                        <a href="#faq" className="text-gray-600 hover:text-blue-600">FAQ</a>
                    </div>
                </nav>
            </div>
        </header>
    )
}