"use client"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import ReviewModal from "../components/ReviewModal.jsx"
import { useServices, ServicesProvider } from "../contexts/ServicesContext"

const ServicesContent = () => {
    const {
        filteredServices,
        isLoading,
        errorMessage,
        successMessage,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        handleImageError,
        handleReservation,
        handleEditService,
        isServiceOwner,
        getServiceTypeLabel,
        getServiceTypeColor,
        openReviewModal,
        openDeleteModal,
        serviceReviewStats,
        showDeleteModal,
        serviceToDelete,
        setShowDeleteModal,
        handleDeleteService,
        showEditModal,
        serviceToEdit,
        editFormData,
        handleEditFormChange,
        imagePreview,
        handleImageChange,
        handleEditFormSubmit,
        setShowEditModal,
        setServiceToEdit,
        setEditFormData,
        setSelectedImage,
        setImagePreview,
        serviceToReview,
        setServiceToReview,
        setErrorMessage,
        setSuccessMessage,
    } = useServices()

    const navigate = useNavigate()

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut",
            },
        }),
    }

    const renderEditForm = () => {
        if (!serviceToEdit) return null

        const serviceType = getServiceTypeLabel(serviceToEdit)

        return (
            <form onSubmit={handleEditFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                            Nom
                        </label>
                        <input
                            type="text"
                            name="nom"
                            id="nom"
                            value={editFormData.nom || ""}
                            onChange={handleEditFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
                            Prix (MAD)
                        </label>
                        <input
                            type="number"
                            name="prix"
                            id="prix"
                            value={editFormData.prix || 0}
                            onChange={handleEditFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={editFormData.description || ""}
                        onChange={handleEditFormChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <div className="mt-1 flex items-center">
                        {imagePreview && (
                            <div className="relative mr-4">
                                <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Aperçu"
                                    className="h-32 w-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="disponibilite"
                        id="disponibilite"
                        checked={editFormData.disponibilite || false}
                        onChange={handleEditFormChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="disponibilite" className="ml-2 block text-sm text-gray-900">
                        Disponible
                    </label>
                </div>

                {serviceType === "Transport" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Type de transport
                                </label>
                                <select
                                    name="type"
                                    id="type"
                                    value={editFormData.type || ""}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Sélectionner un type</option>
                                    <option value="Voiture">Voiture</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Train">Train</option>
                                    <option value="Avion">Avion</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Date et heure
                                </label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    id="date"
                                    value={editFormData.date ? new Date(editFormData.date).toISOString().slice(0, 16) : ""}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="depart" className="block text-sm font-medium text-gray-700">
                                    Lieu de départ
                                </label>
                                <input
                                    type="text"
                                    name="depart"
                                    id="depart"
                                    value={editFormData.depart || ""}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                                    Destination
                                </label>
                                <input
                                    type="text"
                                    name="destination"
                                    id="destination"
                                    value={editFormData.destination || ""}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                Durée (minutes)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                id="duration"
                                value={editFormData.duration || 0}
                                onChange={handleEditFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                )}

                {serviceType === "Restauration" && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                Adresse
                            </label>
                            <input
                                type="text"
                                name="adresse"
                                id="adresse"
                                value={editFormData.adresse || ""}
                                onChange={handleEditFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Menu</label>
                            <p className="text-xs text-gray-500 mb-2">Entrez chaque élément du menu sur une nouvelle ligne</p>
                            <textarea
                                name="menuText"
                                rows={4}
                                value={(editFormData.menu || []).join("\n")}
                                onChange={(e) => {
                                    const menuItems = e.target.value.split("\n").filter((item) => item.trim() !== "")
                                    setEditFormData((prev) => ({
                                        ...prev,
                                        menu: menuItems,
                                    }))
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Options de régime</label>
                            <p className="text-xs text-gray-500 mb-2">Entrez chaque option sur une nouvelle ligne</p>
                            <textarea
                                name="optionRegimeText"
                                rows={3}
                                value={(editFormData.optionRegime || []).join("\n")}
                                onChange={(e) => {
                                    const options = e.target.value.split("\n").filter((item) => item.trim() !== "")
                                    setEditFormData((prev) => ({
                                        ...prev,
                                        optionRegime: options,
                                    }))
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                )}

                {serviceType === "Hébergement" && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                Type d'hébergement
                            </label>
                            <select
                                name="type"
                                id="type"
                                value={editFormData.type || ""}
                                onChange={handleEditFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                Adresse
                            </label>
                            <input
                                type="text"
                                name="adresse"
                                id="adresse"
                                value={editFormData.adresse || ""}
                                onChange={handleEditFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                Note (sur 5)
                            </label>
                            <input
                                type="number"
                                name="note"
                                id="note"
                                min="0"
                                max="5"
                                step="0.1"
                                value={editFormData.note || 0}
                                onChange={handleEditFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Horaires disponibles</label>
                            <p className="text-xs text-gray-500 mb-2">Format: YYYY-MM-DD HH:MM (un par ligne)</p>
                            <textarea
                                name="horairesText"
                                rows={4}
                                value={(editFormData.horaires || [])
                                    .map((h) => new Date(h).toISOString().slice(0, 16).replace("T", " "))
                                    .join("\n")}
                                onChange={(e) => {
                                    try {
                                        const horaires = e.target.value
                                            .split("\n")
                                            .filter((item) => item.trim() !== "")
                                            .map((item) => {
                                                const date = new Date(item.replace(" ", "T"))
                                                return date.toISOString()
                                            })
                                        setEditFormData((prev) => ({
                                            ...prev,
                                            horaires: horaires,
                                        }))
                                    } catch (error) {
                                        console.error("Erreur de format de date:", error)
                                    }
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => {
                            setShowEditModal(false)
                            setServiceToEdit(null)
                            setEditFormData({})
                            setSelectedImage(null)
                            setImagePreview("")
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        )
    }

    // Fonction pour afficher les détails du service
    const renderServiceDetails = (service) => {
        if (service.type && service.date) {
            return (
                <div className="mt-4 space-y-3">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-600"
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
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Date</p>
                            <p className="text-sm text-gray-600">
                                {new Date(service.date).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Durée</p>
                            <p className="text-sm text-gray-600">{service.duration} minutes</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-600"
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
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Type</p>
                            <p className="text-sm text-gray-600">{service.type}</p>
                        </div>
                    </div>
                </div>
            )
        } else if (service.menu) {
            // Contenu pour les services de restauration
            return <div className="mt-4 space-y-3">{/* Contenu pour les services de restauration */}</div>
        } else if (service.horaires) {
            // Contenu pour les services d'hébergement
            return <div className="mt-4 space-y-3">{/* Contenu pour les services d'hébergement */}</div>
        }
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50">
            {/* Notification de succès pour réservation */}
            <div
                id="notification"
                className="fixed top-20 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg hidden transform transition-transform duration-300 ease-in-out"
            >
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm">Réservation créée avec succès ! Redirection vers le paiement...</p>
                    </div>
                </div>
            </div>

            {/* Message de succès */}
            {successMessage && (
                <div className="fixed top-20 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg transform transition-transform duration-300 ease-in-out">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* En-tête de la page */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Découvrez nos services</h1>
                            <p className="mt-1 text-gray-600">Explorez notre sélection de services pour votre voyage au Maroc</p>
                        </div>
                        <div className="flex space-x-3">

                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Rechercher un service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeFilter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Tous
                            </button>
                            <button
                                onClick={() => setActiveFilter("transport")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeFilter === "transport" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                }`}
                            >
                                Transport
                            </button>
                            <button
                                onClick={() => setActiveFilter("restauration")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeFilter === "restauration"
                                        ? "bg-green-600 text-white"
                                        : "bg-green-50 text-green-700 hover:bg-green-100"
                                }`}
                            >
                                Restauration
                            </button>
                            <button
                                onClick={() => setActiveFilter("hebergement")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeFilter === "hebergement"
                                        ? "bg-purple-600 text-white"
                                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                }`}
                            >
                                Hébergement
                            </button>
                        </div>
                    </div>
                </div>

                {/* État de chargement */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    </div>
                )}

                {/* Message d'erreur */}
                {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{errorMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Aucun service trouvé */}
                {!isLoading && filteredServices.length === 0 && !errorMessage && (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun service trouvé</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            {searchQuery
                                ? `Aucun résultat pour "${searchQuery}". Essayez avec d'autres termes.`
                                : "Aucun service disponible pour le moment."}
                        </p>
                        {activeFilter !== "all" && (
                            <button
                                onClick={() => setActiveFilter("all")}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Voir tous les services
                            </button>
                        )}
                    </div>
                )}

                {/* Liste des services */}
                {!isLoading && filteredServices.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service, index) => (
                            <motion.div
                                key={service.id || index}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                custom={index}
                                whileHover={{ y: -5, scale: 1.02 }}
                                onClick={() => navigate(`/services/${service.id}`)}
                            >
                                {/* Image du service */}
                                <div className="h-56 w-full overflow-hidden relative">
                                    <img
                                        src={
                                            service.imageUrl
                                                ? `http://localhost:8081${service.imageUrl}`
                                                : "/placeholder.svg?height=300&width=500"
                                        }
                                        alt={service.nom || "Service"}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                        onError={handleImageError}
                                    />
                                    <div className="absolute top-0 right-0 m-3">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getServiceTypeColor(service)}`}
                    >
                      {getServiceTypeLabel(service)}
                    </span>
                                    </div>

                                    {/* Boutons d'édition et de suppression pour les propriétaires */}
                                    {isServiceOwner(service) && (
                                        <div className="absolute top-3 left-3 flex space-x-2 z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEditService(service)
                                                }}
                                                className="bg-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                                                title="Modifier"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => openDeleteModal(service, e)}
                                                className="bg-red-600 p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                                                title="Supprimer"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Contenu du service */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                                            {service.nom || "Service sans nom"}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                service.disponibilite ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                        >
                      {service.disponibilite ? "Disponible" : "Indisponible"}
                    </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">
                                        {service.description || "Aucune description disponible"}
                                    </p>

                                    {/* Affichage des avis */}
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center">
                                            {serviceReviewStats[service.id]?.averageRating > 0 ? (
                                                <>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`h-4 w-4 ${i < Math.floor(serviceReviewStats[service.id]?.averageRating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="ml-1 text-sm font-medium text-gray-700">
                            {serviceReviewStats[service.id]?.averageRating.toFixed(1)}
                          </span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-500">Pas d'avis</span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-600">
                      {serviceReviewStats[service.id]?.reviewCount || 0} avis
                    </span>
                                    </div>

                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center">
                                            <svg
                                                className="h-5 w-5 text-indigo-500 mr-1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="text-sm text-gray-600">
                        {service.duration ? `${service.duration} min` : "Durée non spécifiée"}
                      </span>
                                        </div>
                                        <div className="text-2xl font-bold text-indigo-600">{service.prix} MAD</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/services/${service.id}`)
                                            }}
                                            className="bg-white border-2 border-indigo-500 rounded-lg py-2.5 px-4 text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            Détails
                                        </button>
                                        {isServiceOwner(service) ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEditService(service)
                                                }}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors"
                                            >
                                                Modifier
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const result = handleReservation(service.id, service.prix)
                                                    if (result && result.success) {
                                                        navigate("/payment", {
                                                            state: { reservationId: result.reservationId, amount: result.amount },
                                                        })
                                                    }
                                                }}
                                                disabled={!service.disponibilite}
                                                className={`rounded-lg py-2.5 px-4 text-sm font-medium text-white transition-colors ${
                                                    service.disponibilite
                                                        ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        : "bg-gray-400 cursor-not-allowed"
                                                }`}
                                            >
                                                Réserver
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                openReviewModal(service)
                                            }}
                                            className="col-span-2 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors"
                                        >
                                            Ajouter une review
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowDeleteModal(false)}
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Confirmer la suppression
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Êtes-vous sûr de vouloir supprimer ce service ? Cette action ne peut pas être annulée.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleDeleteService}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Supprimer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'édition de service */}
            {showEditModal && serviceToEdit && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowEditModal(false)}
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Modifier le service: {serviceToEdit.nom}
                                    </h3>
                                    <button
                                        type="button"
                                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        <span className="sr-only">Fermer</span>
                                        <svg
                                            className="h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-2 max-h-[70vh] overflow-y-auto pr-2">{renderEditForm()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Composant ReviewModal */}
            <ReviewModal
                isOpen={serviceToReview !== null}
                onClose={() => setServiceToReview(null)}
                service={serviceToReview}
                onSuccess={(message) => {
                    setSuccessMessage(message)
                    setTimeout(() => setSuccessMessage(""), 3000)
                }}
                onError={(message) => {
                    setErrorMessage(message)
                    setTimeout(() => setErrorMessage(""), 3000)
                }}
            />
        </div>
    )
}

// Composant wrapper qui fournit le contexte
const Services = () => {
    return (
        <ServicesProvider>
            <ServicesContent />
        </ServicesProvider>
    )
}

export default Services

