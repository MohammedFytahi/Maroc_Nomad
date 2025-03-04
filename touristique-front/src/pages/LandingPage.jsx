import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role"); // Récupère le rôle stocké
        setIsAuthenticated(!!token);
        setRole(userRole);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role"); // Supprime le rôle à la déconnexion
        setIsAuthenticated(false);
        setRole(null);
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-200 to-indigo-200 text-gray-800 font-sans">
            {/* Navigation Header */}
            <header className="fixed top-0 w-full bg-indigo-50 shadow-md z-50 backdrop-blur-sm">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-800 tracking-wide">
                        Maroc 2030
                    </h1>

                    <div className="space-x-4 flex items-center">
                        {role === "PROVIDER" && (
                            <Link to="/provider/add-service" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200">
                                Add Service
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-800 font-semibold transition-colors duration-200"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
                                    Register
                                </Link>
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="pt-20 pb-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h1 className="text-5xl font-extrabold text-indigo-900 mb-6 tracking-tight drop-shadow-md">
                            Discover Morocco with Maroc 2030
                        </h1>
                        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                            Plan your perfect trip with our all-in-one platform for accommodations, transport, dining, and activities.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-teal-100 font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200">
                                Get Started
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/login" className="bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-teal-100 font-bold py-3 px-8 rounded-xl shadow-md transition-all duration-200">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <img src="https://en.7news.ma/wp-content/uploads/2021/06/40-e%CC%81tablissements-touristiques-en-cours-de-re%CC%81alisation-ou-de%CC%81tude-a%CC%80-Fe%CC%80s.jpg"
                             alt="Stunning Moroccan landscape"
                             className="w-full h-auto rounded-2xl shadow-xl transform transition-all hover:scale-105 duration-300"
                        />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-teal-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-indigo-800 mb-10 tracking-wide drop-shadow-md">
                        Our Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { title: "Accommodations", desc: "Book riads, hotels, and more across Morocco.", img: "99570" },
                            { title: "Transport", desc: "Rent cars, book trains, and explore easily.", img: "11749" },
                            { title: "Dining", desc: "Discover local restaurants with personalized menus.", img: "18733" },
                            { title: "Activities", desc: "Enjoy tours, events, and cultural experiences.", img: "63048" },
                        ].map((service, index) => (
                            <div key={index} className="p-6 bg-indigo-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200">
                                <img src={`https://img.icons8.com/?size=100&id=${service.img}&format=png&color=000000`} alt={service.title} className="w-16 h-16 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-indigo-800 mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-indigo-50 shadow-md">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
                    <p>© {new Date().getFullYear()} Maroc 2030. All rights reserved.</p>
                    <p className="mt-2">
                        Contact us: <a href="mailto:contact@maroc2030.com" className="text-indigo-600 hover:underline">contact@maroc2030.com</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
