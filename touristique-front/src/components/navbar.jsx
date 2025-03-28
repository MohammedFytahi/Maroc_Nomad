"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

 const Menu = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
    >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
)

const X = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
)

const LogOut = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
)

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [role, setRole] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    // Check if the current route is active
    const isActive = (path) => {
        return location.pathname === path
    }

    return (
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

                        <Link
                            to="/services"
                            className={`transition-colors ${isActive("/services") ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"}`}
                        >
                            Services
                        </Link>
                        <Link
                            to="/about"
                            className={`transition-colors ${isActive("/about") ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"}`}
                        >
                            À propos
                        </Link>

                        {isAuthenticated && role !== "PROVIDER" && (
                            <Link
                                to="/reservations"
                                className={`transition-colors ${isActive("/reservations") ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"}`}
                            >
                                Mes réservations
                            </Link>
                        )}

                        {isAuthenticated && role === "PROVIDER" && (
                            <>
                                <Link
                                    to="/provider-stats"
                                    className={`transition-colors ${isActive("/provider/services") ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"}`}
                                >
                                    Mes services
                                </Link>
                                <Link
                                    to="/provider/add-service"
                                    className={`bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors ${isActive("/provider/add-service") ? "bg-green-700" : ""}`}
                                >
                                    Ajouter un service
                                </Link>
                            </>
                        )}

                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-1" />
                                Déconnexion
                            </button>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className={`transition-colors ${isActive("/login") ? "text-indigo-800 font-medium" : "text-indigo-600 hover:text-indigo-800"}`}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors ${isActive("/register") ? "bg-indigo-700" : ""}`}
                                >
                                    Inscription
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
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/destinations") ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"}`}
                            onClick={closeMenu}
                        >
                            Destinations
                        </Link>
                        <Link
                            to="/services"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/services") ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"}`}
                            onClick={closeMenu}
                        >
                            Services
                        </Link>
                        <Link
                            to="/about"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/about") ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"}`}
                            onClick={closeMenu}
                        >
                            À propos
                        </Link>

                        {isAuthenticated && role !== "PROVIDER" && (
                            <Link
                                to="/reservations"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/reservations") ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"}`}
                                onClick={closeMenu}
                            >
                                Mes réservations
                            </Link>
                        )}

                        {isAuthenticated && role === "PROVIDER" && (
                            <>
                                <Link
                                    to="/provider/services"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/provider/services") ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"}`}
                                    onClick={closeMenu}
                                >
                                    Mes services
                                </Link>
                                <Link
                                    to="/provider/add-service"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
                                    onClick={closeMenu}
                                >
                                    Ajouter un service
                                </Link>
                            </>
                        )}

                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    handleLogout()
                                    closeMenu()
                                }}
                                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Déconnexion
                            </button>
                        ) : (
                            <div className="space-y-1">
                                <Link
                                    to="/login"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/login") ? "text-indigo-800 bg-indigo-50" : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"}`}
                                    onClick={closeMenu}
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    onClick={closeMenu}
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar