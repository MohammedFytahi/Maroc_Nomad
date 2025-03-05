"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MapPin, Search, LogOut, Menu, X, ChevronRight, Star, Mail } from "lucide-react"

const LandingPage = () => {
    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [role, setRole] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const userRole = localStorage.getItem("role")
        setIsAuthenticated(!!token)
        setRole(userRole)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        setIsAuthenticated(false)
        setRole(null)
        navigate("/login")
    }

    const handleAddServiceClick = (e) => {
        e.preventDefault()
        // Just navigate to the add service page, don't make API call here
        navigate("/provider/add-service")
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setIsLoading(true)
            // Simulate search delay
            setTimeout(() => {
                setIsLoading(false)
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
            }, 500)
        }
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    // Featured destinations data
    const featuredDestinations = [
        {
            id: 1,
            name: "Marrakech",
            image:
                "https://images.unsplash.com/photo-1597212720452-0576f19b536a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            description: "Explore the vibrant markets and historic palaces of the Red City.",
            rating: 4.8,
        },
        {
            id: 2,
            name: "Chefchaouen",
            image: "https://images.unsplash.com/photo-1548017860-48fc12cc7a2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            description: "Discover the enchanting blue streets of Morocco's Blue Pearl.",
            rating: 4.7,
        },
        {
            id: 3,
            name: "Essaouira",
            image:
                "https://images.unsplash.com/photo-1577007053429-f8d0e8e0cbcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            description: "Experience the coastal charm and rich history of this port city.",
            rating: 4.6,
        },
    ]

    // Testimonials data
    const testimonials = [
        {
            id: 1,
            name: "Sarah L.",
            text: "Maroc 2030 made planning our family trip to Morocco so easy! The local guides were exceptional.",
            avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        },
        {
            id: 2,
            name: "Mohammed A.",
            text: "As a local business owner, partnering with Maroc 2030 has brought me many new customers. Highly recommended!",
            avatar: "https://randomuser.me/api/portraits/men/54.jpg",
        },
        {
            id: 3,
            name: "Emma T.",
            text: "The personalized itinerary suggestions were perfect for our honeymoon. We discovered places we would have never found on our own.",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 text-gray-800 font-sans">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/90 shadow-sm z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                  Maroc 2030
                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link to="/destinations" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                Destinations
                            </Link>
                            <Link to="/services" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                Services
                            </Link>
                            <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                About Us
                            </Link>

                            {role === "PROVIDER" && (
                                <Link
                                    to="/provider/add-service"
                                    onClick={handleAddServiceClick}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
                                >
                                    Add Service
                                </Link>
                            )}

                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-1" />
                                    Logout
                                </button>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-600 hover:text-indigo-800 focus:outline-none"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-lg rounded-b-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link
                                to="/destinations"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Destinations
                            </Link>
                            <Link
                                to="/services"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                to="/about"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About Us
                            </Link>

                            {role === "PROVIDER" && (
                                <Link
                                    to="/provider/add-service"
                                    onClick={(e) => {
                                        handleAddServiceClick(e)
                                        setIsMenuOpen(false)
                                    }}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
                                >
                                    Add Service
                                </Link>
                            )}

                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        setIsMenuOpen(false)
                                    }}
                                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            ) : (
                                <div className="space-y-1">
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="pt-28 pb-16 md:pt-32 md:pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                                    <span className="block">Discover the Magic</span>
                                    <span className="block text-indigo-600">of Morocco</span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                                    Plan your perfect Moroccan adventure with our all-in-one platform. From ancient medinas to stunning
                                    beaches, experience it all with Maroc 2030.
                                </p>

                                {/* Search Form */}
                                <form onSubmit={handleSearch} className="relative max-w-md mx-auto md:mx-0 mb-8">
                                    <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 bg-white">
                                        <input
                                            type="text"
                                            placeholder="Search destinations, activities..."
                                            className="w-full py-3 px-4 focus:outline-none"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 transition-colors"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Search className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <Link
                                        to="/destinations"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                                    >
                                        Explore Now
                                    </Link>
                                    {!isAuthenticated && (
                                        <Link
                                            to="/register"
                                            className="bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-xl transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 mt-8 md:mt-0">
                                <div className="relative">
                                    <img
                                        src="https://en.7news.ma/wp-content/uploads/2021/06/40-e%CC%81tablissements-touristiques-en-cours-de-re%CC%81alisation-ou-de%CC%81tude-a%CC%80-Fe%CC%80s.jpg"
                                        alt="Moroccan landscape"
                                        className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                                    />
                                    <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                                        <div className="flex items-center">
                                            <div className="bg-yellow-400 rounded-full p-2 mr-3">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">Fes, Morocco</p>
                                                <p className="text-sm text-gray-500">Cultural Heritage</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Destinations */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Destinations</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Discover the most popular destinations across Morocco that travelers love
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredDestinations.map((destination) => (
                                <div
                                    key={destination.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
                                >
                                    <div className="relative h-60">
                                        <img
                                            src={destination.image || "/placeholder.svg"}
                                            alt={destination.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center shadow-md">
                                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                            <span className="font-medium text-sm">{destination.rating}</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                                        <p className="text-gray-600 mb-4">{destination.description}</p>
                                        <Link
                                            to={`/destinations/${destination.id}`}
                                            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                                        >
                                            Discover more
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                to="/destinations"
                                className="inline-flex items-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                View all destinations
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-16 bg-gradient-to-br from-indigo-50 to-teal-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Maroc 2030</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                We're dedicated to making your Moroccan experience unforgettable
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-indigo-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Local Expertise</h3>
                                <p className="text-gray-600">
                                    Our team of local experts ensures authentic experiences and insider knowledge of Morocco's hidden
                                    gems.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-indigo-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Best Value</h3>
                                <p className="text-gray-600">
                                    We negotiate the best rates with our partners to offer you competitive prices without compromising
                                    quality.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-indigo-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Experience</h3>
                                <p className="text-gray-600">
                                    Tailor your trip to your preferences with our customizable itineraries and personalized
                                    recommendations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Hear from people who have experienced Morocco with us
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="bg-indigo-50 p-6 rounded-xl shadow-sm">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.avatar || "/placeholder.svg"}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-4"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter */}
                <section className="py-16 bg-indigo-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold text-white mb-2">Stay Updated</h2>
                                <p className="text-indigo-100 max-w-md">
                                    Subscribe to our newsletter for travel tips, exclusive offers, and the latest updates on Morocco.
                                </p>
                            </div>
                            <div className="w-full md:w-auto">
                                <form className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Explore Morocco?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Start planning your dream Moroccan adventure today with Maroc 2030.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/destinations"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                            >
                                Explore Destinations
                            </Link>
                            <Link
                                to="/contact"
                                className="bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-xl transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Maroc 2030</h3>
                            <p className="text-gray-400 mb-4">
                                Your gateway to authentic Moroccan experiences. Discover, plan, and enjoy the best of Morocco.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/destinations" className="text-gray-400 hover:text-white transition-colors">
                                        Destinations
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <MapPin className="w-5 h-5 text-indigo-400 mr-2 mt-0.5" />
                                    <span className="text-gray-400">123 Avenue Mohammed V, Rabat, Morocco</span>
                                </li>
                                <li className="flex items-center">
                                    <svg
                                        className="w-5 h-5 text-indigo-400 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <span className="text-gray-400">+212 5XX-XXXXXX</span>
                                </li>
                                <li className="flex items-center">
                                    <Mail className="w-5 h-5 text-indigo-400 mr-2" />
                                    <span className="text-gray-400">info@maroc2030.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-400">© {new Date().getFullYear()} Maroc 2030. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage

