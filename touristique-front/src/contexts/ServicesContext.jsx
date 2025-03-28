"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

// Création du contexte
const ServicesContext = createContext()

// Hook personnalisé pour utiliser le contexte
export const useServices = () => {
    const context = useContext(ServicesContext)
    if (!context) {
        throw new Error("useServices doit être utilisé à l'intérieur d'un ServicesProvider")
    }
    return context
}

// Provider du contexte
export const ServicesProvider = ({ children }) => {
    // États
    const [services, setServices] = useState([])
    const [filteredServices, setFilteredServices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState("all")
    const [selectedService, setSelectedService] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [serviceToDelete, setServiceToDelete] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [serviceToEdit, setServiceToEdit] = useState(null)
    const [editFormData, setEditFormData] = useState({})
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [serviceToReview, setServiceToReview] = useState(null)
    const [serviceReviewStats, setServiceReviewStats] = useState({})

    // Fonction pour gérer les erreurs d'image
    const handleImageError = (e) => {
        e.target.src = "/placeholder.svg?height=300&width=500"
        e.target.alt = "Image non disponible"
    }

    // Récupérer les informations de l'utilisateur actuel
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token")
            const role = localStorage.getItem("role")

            if (token) {
                try {
                    // Essayer d'obtenir les informations utilisateur depuis l'API
                    const response = await axios.get("/api/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    console.log("User info from API:", response.data)
                    setCurrentUser(response.data)
                } catch (error) {
                    console.error("Erreur lors de la récupération des informations utilisateur:", error)

                    // En cas d'échec, utiliser au moins le rôle stocké dans localStorage
                    if (role) {
                        setCurrentUser({ role: role })
                        console.log("Using role from localStorage:", role)
                    }
                }
            } else if (role) {
                // Si nous avons au moins le rôle, utilisons-le
                setCurrentUser({ role: role })
                console.log("Using role from localStorage (no token):", role)
            }
        }

        fetchCurrentUser()
    }, [])

    // Récupérer les services
    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true)
            setErrorMessage("")
            const token = localStorage.getItem("token")

            if (!token) {
                setErrorMessage("Veuillez vous connecter pour voir les services")
                return
            }

            try {
                const response = await axios.get("/api/services/all", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                console.log("Réponse de l'API :", response.data)
                setServices(response.data)
                setFilteredServices(response.data)
            } catch (error) {
                console.error("Erreur lors de la récupération des services :", error.response?.status, error.response?.data)
                setErrorMessage(error.response?.data?.message || "Erreur lors de la récupération des services")
            } finally {
                setIsLoading(false)
            }
        }

        fetchServices()
    }, [])

    // Récupérer les statistiques des avis pour tous les services
    const fetchReviewStats = async () => {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const statsPromises = services.map((service) =>
                axios.get(`/api/reviews/service/${service.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            )

            const statsResponses = await Promise.all(statsPromises)

            const statsMap = {}
            statsResponses.forEach((response, index) => {
                const serviceId = services[index].id
                statsMap[serviceId] = {
                    reviewCount: response.data.reviewCount || 0,
                    averageRating: response.data.averageRating || 0,
                }
            })

            setServiceReviewStats(statsMap)
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques des avis:", error)
        }
    }

    // Charger les statistiques des avis après le chargement des services
    useEffect(() => {
        if (services.length > 0) {
            fetchReviewStats()
        }
    }, [services])

    // Filtrer les services
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
                (service) => service.nom?.toLowerCase().includes(query) || service.description?.toLowerCase().includes(query),
            )
        }

        setFilteredServices(result)
    }, [services, searchQuery, activeFilter])

    // Réserver un service
    const handleReservation = async (serviceId, amount) => {
        const token = localStorage.getItem("token")

        if (!token) {
            setErrorMessage("Veuillez vous connecter pour réserver un service")
            return
        }

        try {
            // Étape 1 : Créer la réservation
            const reservationResponse = await axios.post(
                `/api/reservations/reserver/${serviceId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )

            if (reservationResponse.status === 200) {
                const reservationId = reservationResponse.data.id // Récupérer l'ID de la réservation

                // Fermer le modal si ouvert
                setShowModal(false)

                // Notification de succès
                const notification = document.getElementById("notification")
                if (notification) {
                    notification.classList.remove("hidden")
                    setTimeout(() => {
                        notification.classList.add("hidden")
                    }, 1500)
                }

                return { success: true, reservationId, amount }
            }
        } catch (error) {
            console.error("Erreur lors de la réservation:", error)
            setErrorMessage(error.response?.data?.message || "Erreur lors de la réservation")
            return { success: false, error: error.response?.data?.message || "Erreur lors de la réservation" }
        }
    }

    // Supprimer un service
    const handleDeleteService = async () => {
        if (!serviceToDelete) return

        const token = localStorage.getItem("token")
        if (!token) {
            setErrorMessage("Veuillez vous connecter pour supprimer un service")
            return
        }

        try {
            await axios.delete(`/api/services/${serviceToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            // Mettre à jour la liste des services
            setServices(services.filter((service) => service.id !== serviceToDelete.id))
            setSuccessMessage("Service supprimé avec succès !")

            // Fermer le modal de confirmation
            setShowDeleteModal(false)
            setServiceToDelete(null)

            // Afficher le message de succès pendant 3 secondes
            setTimeout(() => {
                setSuccessMessage("")
            }, 3000)
        } catch (error) {
            console.error("Erreur lors de la suppression du service:", error)
            setErrorMessage(error.response?.data?.message || "Erreur lors de la suppression du service")

            // Fermer le modal de confirmation
            setShowDeleteModal(false)
            setServiceToDelete(null)

            // Effacer le message d'erreur après 3 secondes
            setTimeout(() => {
                setErrorMessage("")
            }, 3000)
        }
    }

    // Préparer le formulaire d'édition
    const handleEditService = (service) => {
        setServiceToEdit(service)

        // Initialiser les données du formulaire avec les valeurs actuelles du service
        const formData = {
            id: service.id,
            nom: service.nom || "",
            description: service.description || "",
            prix: service.prix || 0,
            disponibilite: service.disponibilite || true,
            imageUrl: service.imageUrl || "",
        }

        // Ajouter des champs spécifiques selon le type de service
        if (service.type && service.date) {
            // Transport
            formData.type = service.type || ""
            formData.date = service.date || ""
            formData.duration = service.duration || 0
            formData.depart = service.depart || ""
            formData.destination = service.destination || ""
        } else if (service.menu) {
            // Restauration
            formData.menu = service.menu || []
            formData.optionRegime = service.optionRegime || []
            formData.adresse = service.adresse || ""
        } else if (service.horaires) {
            // Hébergement
            formData.type = service.type || ""
            formData.horaires = service.horaires || []
            formData.adresse = service.adresse || ""
            formData.note = service.note || 0
        }

        setEditFormData(formData)
        setImagePreview(service.imageUrl ? `http://localhost:8081${service.imageUrl}` : "")
        setShowEditModal(true)
    }

    // Gérer les changements dans le formulaire d'édition
    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target

        setEditFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // Gérer le changement d'image
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0])
            setImagePreview(URL.createObjectURL(e.target.files[0]))
        }
    }

    // Soumettre le formulaire d'édition
    const handleEditFormSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token")
        if (!token) {
            setErrorMessage("Veuillez vous connecter pour modifier un service")
            return
        }

        // Déterminer le type de service
        let serviceType = ""
        if (serviceToEdit.type && serviceToEdit.date) {
            serviceType = "transport"
        } else if (serviceToEdit.menu) {
            serviceType = "restauration"
        } else if (serviceToEdit.horaires) {
            serviceType = "hebergement"
        } else {
            serviceType = "activite"
        }

        try {
            // Créer un FormData pour envoyer les données et l'image
            const formData = new FormData()

            // Préparer les données du service
            const serviceData = { ...editFormData }

            // Si le service n'a pas de providerId, ajouter l'ID de l'utilisateur actuel
            if (!serviceToEdit.providerId && currentUser && currentUser.id) {
                serviceData.providerId = currentUser.id
            }

            console.log("Données du service à envoyer:", serviceData)

            // Ajouter les données du service
            formData.append("service", JSON.stringify(serviceData))

            // Ajouter l'image si elle a été modifiée
            if (selectedImage) {
                formData.append("image", selectedImage)
            }

            // Envoyer la requête
            const response = await axios.put(`/api/services/${serviceType}/${serviceToEdit.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.status === 200) {
                // Mettre à jour la liste des services
                const updatedServices = services.map((service) =>
                    service.id === serviceToEdit.id ? { ...service, ...serviceData } : service,
                )
                setServices(updatedServices)

                // Afficher un message de succès
                setSuccessMessage("Service modifié avec succès !")

                // Fermer le modal
                setShowEditModal(false)
                setServiceToEdit(null)
                setEditFormData({})
                setSelectedImage(null)
                setImagePreview("")

                // Effacer le message après 3 secondes
                setTimeout(() => {
                    setSuccessMessage("")
                }, 3000)
            }
        } catch (error) {
            console.error("Erreur lors de la modification du service:", error)
            setErrorMessage(error.response?.data?.message || "Erreur lors de la modification du service")

            // Effacer le message après 3 secondes
            setTimeout(() => {
                setErrorMessage("")
            }, 3000)
        }
    }

    // Vérifier si l'utilisateur est le propriétaire du service
    const isServiceOwner = (service) => {
        console.log("Current user:", currentUser)
        console.log("Service:", service)
        console.log("Service provider ID:", service.providerId)

        // Si nous n'avons pas d'information sur l'utilisateur actuel, retourner false
        if (!currentUser) {
            console.log("No current user, returning false")
            return false
        }

        // Si l'utilisateur est un ADMIN, montrer les boutons pour tous les services
        if (currentUser.role === "ADMIN") {
            console.log("User is ADMIN, returning true")
            return true
        }

        // Si l'utilisateur est un PROVIDER
        if (currentUser.role === "PROVIDER") {
            // Pour le débogage, afficher les deux valeurs que nous comparons
            console.log(`Comparing provider IDs: currentUser.id=${currentUser.id}, service.providerId=${service.providerId}`)

            // Vérifier si le service a un providerId
            if (!service.providerId) {
                console.log("Service has no providerId, showing buttons for all PROVIDER users")
                return true // Si le service n'a pas de providerId, montrer les boutons pour tous les PROVIDER
            }

            // Vérifier si l'ID du provider correspond à l'ID de l'utilisateur
            const isOwner = service.providerId === currentUser.id
            console.log("Is owner?", isOwner)
            return isOwner
        }

        // Pour les autres rôles, ne pas montrer les boutons d'édition/suppression
        console.log("User has another role, returning false")
        return false
    }

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
            case "Transport":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "Restauration":
                return "bg-green-100 text-green-800 border-green-200"
            case "Hébergement":
                return "bg-purple-100 text-purple-800 border-purple-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Ouvrir le modal de review
    const openReviewModal = (service) => {
        setServiceToReview(service)
    }

    // Ouvrir le modal de suppression
    const openDeleteModal = (service, e) => {
        if (e) e.stopPropagation()
        setServiceToDelete(service)
        setShowDeleteModal(true)
    }

    // Valeurs exposées par le contexte
    const value = {
        services,
        setServices,
        filteredServices,
        setFilteredServices,
        isLoading,
        setIsLoading,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        selectedService,
        setSelectedService,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        serviceToDelete,
        setServiceToDelete,
        currentUser,
        setCurrentUser,
        showEditModal,
        setShowEditModal,
        serviceToEdit,
        setServiceToEdit,
        editFormData,
        setEditFormData,
        selectedImage,
        setSelectedImage,
        imagePreview,
        setImagePreview,
        serviceToReview,
        setServiceToReview,
        serviceReviewStats,
        setServiceReviewStats,
        handleImageError,
        handleReservation,
        handleDeleteService,
        handleEditService,
        handleEditFormChange,
        handleImageChange,
        handleEditFormSubmit,
        isServiceOwner,
        getServiceTypeLabel,
        getServiceTypeColor,
        openReviewModal,
        openDeleteModal,
        fetchReviewStats,
    }

    return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
}

