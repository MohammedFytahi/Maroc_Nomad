"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const Services = () => {
    const [services, setServices] = useState([])
    const [filteredServices, setFilteredServices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState("all")
    const navigate = useNavigate()

    // URL de base pour les images (ajustez selon votre serveur backend)
    const BASE_IMAGE_URL = "http://localhost:8081"

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            setErrorMessage("");
            const token = localStorage.getItem("token");

            if (!token) {
                setErrorMessage("Veuillez vous connecter pour voir les services");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("/api/services/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Réponse de l'API :", response.data); // Ajoutez ce log
                setServices(response.data);
                setFilteredServices(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des services :", error.response?.status, error.response?.data);
                setErrorMessage(error.response?.data?.message || "Erreur lors de la récupération des services");
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, [navigate]);
    // Fonction pour filtrer les services
    useEffect(() => {
        let result = services

        if (activeFilter !== "all") {
            if (activeFilter === "transport") {
                result = result.filter((service) => service.type && service.date)
            } else if (activeFilter === "restauration") {
                result = result.filter((service) => service.menu)
            } else if (activeFilter === "hebergement") {
                result = result.filter((service) => service.horaires)
            }
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (service) => service.nom.toLowerCase().includes(query) || service.description.toLowerCase().includes(query),
            )
        }

        setFilteredServices(result)
    }, [services, searchQuery, activeFilter])

    const handleReservation = async (serviceId, amount) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setErrorMessage("Veuillez vous connecter pour réserver un service");
            navigate("/login");
            return;
        }

        try {
            // Étape 1 : Créer la réservation
            const reservationResponse = await axios.post(
                `/api/reservations/reserver/${serviceId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (reservationResponse.status === 200) {
                const reservationId = reservationResponse.data.id; // Récupérer l'ID de la réservation
                alert("Réservation créée avec succès !");

                // Étape 2 : Rediriger vers la page de paiement avec l'ID de la réservation et le montant
                navigate('/payment', { state: { reservationId, amount } });
            }
        } catch (error) {
            console.error("Erreur lors de la réservation:", error);
            setErrorMessage(error.response?.data?.message || "Erreur lors de la réservation");
        }
    };
    // Fonction pour déterminer le type de service
    const getServiceTypeLabel = (service) => {
        if (service.type && service.date) return "Transport"
        if (service.menu) return "Restauration"
        if (service.horaires) return "Hébergement"
        return "Autre"
    }

    // Fonction pour déterminer la couleur du type de service
    const getServiceTypeColor = (service) => {
        const type = getServiceTypeLabel(service)
        switch (type) {
            case "Transport": return "bg-blue-100 text-blue-800"
            case "Restauration": return "bg-green-100 text-green-800"
            case "Hébergement": return "bg-purple-100 text-purple-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    // Fonction pour afficher les détails du service
    const renderServiceDetails = (service) => {
        if (service.type && service.date) {
            return (
                <div className="mt-4 space-y-2">
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" /* ... */>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Date</p>
                            <p className="text-sm text-gray-600">{new Date(service.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" /* ... */>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Durée</p>
                            <p className="text-sm text-gray-600">{service.duration} minutes</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" /* ... */>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Type</p>
                            <p className="text-sm text-gray-600">{service.type}</p>
                        </div>
                    </div>
                </div>
            )
        } else if (service.menu) {
            return (
                <div className="mt-4 space-y-2">
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" /* ... */>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Menu</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside ml-1">
                                {service.menu.map((item, idx) => <li key={idx}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                    {service.optionRegime && service.optionRegime.length > 0 && (
                        <div className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" /* ... */>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Options de régime</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside ml-1">
                                    {service.optionRegime.map((option, idx) => <li key={idx}>{option}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )
        } else if (service.horaires) {
            return (
                <div className="mt-4 space-y-2">
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" /* ... */>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Type</p>
                            <p className="text-sm text-gray-600">{service.type}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" /* ... */>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Horaires</p>
                            <ul className="text-sm text-gray-600">
                                {service.horaires.map((horaire, idx) => <li key={idx}>{new Date(horaire).toLocaleString("fr-FR")}</li>)}
                            </ul>
                        </div>
                    </div>
                    {service.note && (
                        <div className="flex items-start">
                            <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" /* ... */>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Note</p>
                                <div className="flex items-center">
                                    <p className="text-sm text-gray-600">{service.note}/5</p>
                                    <div className="ml-2 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`h-4 w-4 ${i < Math.floor(service.note) ? "text-yellow-400" : "text-gray-300"}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-600">Maroc 2030</h1>
                    <div className="flex items-center space-x-4">
                        <Link to="/provider/add-service" className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-colors">
                            Ajouter un service
                        </Link>
                        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                            Accueil
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-teal-500 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" /* ... */>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Liste des Services
                        </h2>
                        <p className="text-indigo-100 text-sm">Découvrez tous les services disponibles</p>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                            <div className="relative max-w-xs w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" /* ... */>
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Rechercher un service..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => setActiveFilter("all")} className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === "all" ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"}`}>Tous</button>
                                <button onClick={() => setActiveFilter("transport")} className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === "transport" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>Transport</button>
                                <button onClick={() => setActiveFilter("restauration")} className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === "restauration" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"}`}>Restauration</button>
                                <button onClick={() => setActiveFilter("hebergement")} className={`px-3 py-2 rounded-md text-sm font-medium ${activeFilter === "hebergement" ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}>Hébergement</button>
                            </div>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="p-6 text-center">
                            <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /* ... */>
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-gray-600">Chargement des services...</p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" /* ... */>
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLoading && filteredServices.length === 0 && !errorMessage && (
                        <div className="p-12 text-center">
                            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" /* ... */>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun service trouvé</h3>
                            <p className="text-gray-500 max-w-md mx-auto">{searchQuery ? `Aucun résultat pour "${searchQuery}". Essayez avec d'autres termes.` : "Aucun service disponible pour le moment."}</p>
                            {activeFilter !== "all" && (
                                <button onClick={() => setActiveFilter("all")} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Voir tous les services
                                </button>
                            )}
                        </div>
                    )}

                    {!isLoading && filteredServices.length > 0 && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredServices.map((service, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        {/* Ajout de l'image en haut de la carte */}
                                        <div className="h-48 w-full overflow-hidden">
                                            {service.imageUrl ? (
                                                <img
                                                    src={`${BASE_IMAGE_URL}${service.imageUrl}`}
                                                    alt={service.nom}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=Image+non+disponible")} // Image par défaut en cas d'erreur
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                                    <span className="text-gray-500">Aucune image</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-semibold text-gray-900">{service.nom}</h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getServiceTypeColor(service)}`}>
                                                    {getServiceTypeLabel(service)}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{service.description}</p>
                                        </div>

                                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <svg className="h-5 w-5 text-gray-400 mr-1.5" /* ... */>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-lg font-bold text-gray-900">{service.prix} MAD</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${service.disponibilite ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                        {service.disponibilite ? "Disponible" : "Indisponible"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            {renderServiceDetails(service)}
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                                                <div className="text-xs text-gray-500">ID Fournisseur: {service.providerId}</div>
                                                <button
                                                    onClick={() => handleReservation(service.id, service.prix)}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Réserver
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Services