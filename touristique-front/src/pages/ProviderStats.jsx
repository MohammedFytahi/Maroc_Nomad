"use client"

import { useState, useEffect } from "react"
import { getProviderStats } from "../services/providerService"

const ProviderStats = () => {
    const [stats, setStats] = useState(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedTimeframe, setSelectedTimeframe] = useState("all")

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true)
            try {
                const data = await getProviderStats(selectedTimeframe)
                setStats(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [selectedTimeframe])

    // Fonction pour générer des couleurs aléatoires pour les graphiques
    const getRandomColor = (index) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-yellow-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-red-500",
            "bg-teal-500",
            "bg-orange-500",
        ]
        return colors[index % colors.length]
    }

    // Fonction pour obtenir l'icône en fonction du type de service
    const getServiceIcon = (service) => {
        if (service.serviceNom.toLowerCase().includes("transport")) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                </svg>
            )
        } else if (
            service.serviceNom.toLowerCase().includes("hébergement") ||
            service.serviceNom.toLowerCase().includes("hotel")
        ) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            )
        } else if (
            service.serviceNom.toLowerCase().includes("restauration") ||
            service.serviceNom.toLowerCase().includes("restaurant")
        ) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            )
        } else {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        }
    }

    // Fonction pour obtenir la classe de couleur en fonction de la note
    const getRatingColorClass = (rating) => {
        if (rating >= 4.5) return "text-green-600"
        if (rating >= 4) return "text-green-500"
        if (rating >= 3.5) return "text-yellow-500"
        if (rating >= 3) return "text-yellow-600"
        return "text-red-500"
    }

    // Fonction pour rendre les étoiles de notation
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <svg
                        key={`full-${i}`}
                        className={`h-5 w-5 ${getRatingColorClass(rating)}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}

                {hasHalfStar && (
                    <div className="relative">
                        <svg className={`h-5 w-5 text-gray-300`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                            className={`absolute top-0 left-0 h-5 w-2.5 overflow-hidden ${getRatingColorClass(rating)}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                )}

                {[...Array(emptyStars)].map((_, i) => (
                    <svg key={`empty-${i}`} className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}

                <span className={`ml-2 text-lg font-semibold ${getRatingColorClass(rating)}`}>{rating.toFixed(1)}</span>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-700">Chargement des statistiques...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <svg
                                className="h-5 w-5 text-red-500 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <svg
                            className="h-16 w-16 text-gray-400 mx-auto mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune statistique disponible</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Vous n'avez pas encore de statistiques à afficher. Commencez par ajouter des services pour voir apparaître
                            vos données.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Calculer le total des réservations et des avis
    const totalReservations = Object.values(stats.serviceStats).reduce(
        (sum, service) => sum + service.reservationCount,
        0,
    )

    const totalReviews = Object.values(stats.serviceStats).reduce((sum, service) => sum + service.reviewCount, 0)

    // Calculer la note moyenne globale
    const overallRating =
        Object.values(stats.serviceStats).reduce((sum, service) => sum + service.averageRating * service.reviewCount, 0) /
        totalReviews || 0

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50">
            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Fournisseur</h1>
                    <p className="text-gray-600">Consultez les statistiques détaillées de vos services</p>
                </div>

                {/* Filtres de période */}
                <div className="mb-8 bg-white rounded-xl shadow-md p-4">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedTimeframe("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedTimeframe === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Tout
                        </button>
                        <button
                            onClick={() => setSelectedTimeframe("month")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedTimeframe === "month"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Ce mois
                        </button>
                        <button
                            onClick={() => setSelectedTimeframe("week")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedTimeframe === "week"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Cette semaine
                        </button>
                    </div>
                </div>

                {/* Cartes de statistiques globales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-indigo-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-500">Total Services</h2>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-500">Réservations</h2>
                                <p className="text-2xl font-bold text-gray-900">{totalReservations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-yellow-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-500">Avis</h2>
                                <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-purple-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-500">Note Moyenne</h2>
                                <div className="flex items-center">{renderStars(overallRating)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Graphique de répartition des réservations */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Répartition des Réservations</h2>
                    <div className="h-64">
                        <div className="flex h-full items-end space-x-2">
                            {Object.values(stats.serviceStats).map((service, index) => {
                                const percentage = (service.reservationCount / totalReservations) * 100 || 0
                                return (
                                    <div key={service.serviceId} className="flex flex-col items-center flex-1">
                                        <div className="relative w-full group">
                                            <div
                                                className={`${getRandomColor(index)} rounded-t-lg w-full transition-all duration-300 hover:opacity-90`}
                                                style={{ height: `${percentage}%` }}
                                            >
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {service.reservationCount} réservations ({percentage.toFixed(1)}%)
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-600 truncate w-full text-center" title={service.serviceNom}>
                                            {service.serviceNom.length > 15
                                                ? `${service.serviceNom.substring(0, 15)}...`
                                                : service.serviceNom}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Détails des services */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails des Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(stats.serviceStats).map((service) => (
                        <div
                            key={service.serviceId}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-start mb-4">
                                    <div className="flex-shrink-0">{getServiceIcon(service)}</div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={service.serviceNom}>
                                            {service.serviceNom}
                                        </h3>
                                        <div className="mt-1">{renderStars(service.averageRating)}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">Réservations</span>
                                        <span className="text-lg font-semibold text-indigo-600">{service.reservationCount}</span>
                                    </div>

                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <span className="text-gray-600">Avis</span>
                                        <span className="text-lg font-semibold text-indigo-600">{service.reviewCount}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Taux de conversion</span>
                                        <span className="text-lg font-semibold text-indigo-600">
                      {service.conversionRate ? `${(service.conversionRate * 100).toFixed(1)}%` : "N/A"}
                    </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300 font-medium"
                                        onClick={() => (window.location.href = `/services/${service.serviceId}`)}
                                    >
                                        Voir les détails
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProviderStats

