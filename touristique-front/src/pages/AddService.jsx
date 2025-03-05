"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object().shape({
    typeService: yup.string().required("Type de service requis"),
    nom: yup.string().required("Nom requis"),
    description: yup.string().required("Description requise"),
    prix: yup.number().positive("Le prix doit être positif").required("Prix requis"),
    disponibilite: yup.boolean().required("Disponibilité requise"),
    menu: yup.array().when("typeService", {
        is: "restauration",
        then: () => yup.array().of(yup.string()).min(1, "Au moins un élément de menu requis"),
        otherwise: () => yup.array().optional(),
    }),
    optionRegime: yup.array().when("typeService", {
        is: "restauration",
        then: () => yup.array().of(yup.string()).optional(),
        otherwise: () => yup.array().optional(),
    }),
    type: yup.string().when("typeService", {
        is: "transport",
        then: () => yup.string().required("Type de transport requis"),
        otherwise: () => yup.string().optional(),
    }),
    date: yup.date().when("typeService", {
        is: "transport",
        then: () => yup.date().required("Date requise"),
        otherwise: () => yup.date().optional(),
    }),
    duration: yup.number().when("typeService", {
        is: "transport",
        then: () => yup.number().positive("La durée doit être positive").required("Durée requise"),
        otherwise: () => yup.number().optional(),
    }),
})

const AddService = () => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [menuItems, setMenuItems] = useState([""])
    const [dietOptions, setDietOptions] = useState([""])
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            disponibilite: true,
        },
    })

    const typeService = watch("typeService")
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            console.log("Token envoyé pour /api/auth/me : " + token)
            axios
                .get("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    console.log("Réponse de /api/auth/me :", JSON.stringify(response.data, null, 2)); // Log la réponse complète
                    if (response.data.role !== "PROVIDER") {
                        navigate("/")
                    } else {
                        setUser(response.data)
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la vérification de l'utilisateur :", error)
                    navigate("/login")
                })
        } else {
            navigate("/login")
        }
    }, [navigate])
    const addMenuItem = () => {
        setMenuItems([...menuItems, ""])
    }

    const removeMenuItem = (index) => {
        const newMenuItems = [...menuItems]
        newMenuItems.splice(index, 1)
        setMenuItems(newMenuItems)
    }

    const addDietOption = () => {
        setDietOptions([...dietOptions, ""])
    }

    const removeDietOption = (index) => {
        const newDietOptions = [...dietOptions]
        newDietOptions.splice(index, 1)
        setDietOptions(newDietOptions)
    }
    const onSubmit = async (data) => {
        setIsLoading(true)
        setErrorMessage("")
        setSuccessMessage("")

        const token = localStorage.getItem("token")
        console.log("Token envoyé pour ajout service : " + token)

        if (!user || !user.id) {
            setErrorMessage("Utilisateur non authentifié ou ID manquant")
            setIsLoading(false)
            return
        }

        let endpoint = ""
        let serviceData = {
            nom: data.nom,
            description: data.description,
            prix: data.prix,
            disponibilite: data.disponibilite,
            providerId: user.id, // Utilise directement user.id
        }

        if (data.typeService === "transport") {
            endpoint = "/api/services/transport"
            serviceData = {
                ...serviceData,
                type: data.type,
                date: new Date(data.date),
                duration: parseInt(data.duration),
            }
        } else if (data.typeService === "restauration") {
            endpoint = "/api/services/restauration"
            serviceData = {
                ...serviceData,
                menu: menuItems.filter((item) => item.trim() !== ""),
                optionRegime: dietOptions.filter((option) => option.trim() !== ""),
            }
        }

        console.log("Données envoyées au backend :", JSON.stringify(serviceData, null, 2))

        try {
            const response = await axios.post(endpoint, serviceData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setSuccessMessage("Service ajouté avec succès !")
            reset()
            setMenuItems([""])
            setDietOptions([""])
            setTimeout(() => {
                navigate("/dashboard")
            }, 2000)
        } catch (error) {
            console.error("Erreur lors de l'ajout du service :", error.response?.status, error.response?.data)
            setErrorMessage(error.response?.data?.message || "Erreur lors de l'ajout du service")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-600">Maroc 2030</h1>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Retour à l'accueil
                    </Link>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-teal-500 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ajouter un Service
                        </h2>
                        <p className="text-indigo-100 text-sm">Créez un nouveau service pour vos clients</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
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
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        {/* Service Type */}
                        <div>
                            <label htmlFor="typeService" className="block text-sm font-medium text-gray-700 mb-1">
                                Type de Service <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="typeService"
                                {...register("typeService")}
                                className={`block w-full px-3 py-2 border ${errors.typeService ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                disabled={isLoading}
                            >
                                <option value="">Sélectionner un type...</option>
                                <option value="transport">Transport</option>
                                <option value="restauration">Restauration</option>
                            </select>
                            {errors.typeService && <p className="mt-1 text-sm text-red-600">{errors.typeService.message}</p>}
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nom"
                                    {...register("nom")}
                                    className={`block w-full px-3 py-2 border ${errors.nom ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                    placeholder="Nom du service"
                                    disabled={isLoading}
                                />
                                {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix (MAD) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="prix"
                                    {...register("prix")}
                                    className={`block w-full px-3 py-2 border ${errors.prix ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    disabled={isLoading}
                                />
                                {errors.prix && <p className="mt-1 text-sm text-red-600">{errors.prix.message}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                {...register("description")}
                                rows={4}
                                className={`block w-full px-3 py-2 border ${errors.description ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Décrivez votre service en détail..."
                                disabled={isLoading}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                        </div>

                        {/* Availability */}
                        <div>
                            <label htmlFor="disponibilite" className="block text-sm font-medium text-gray-700 mb-1">
                                Disponibilité <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="disponibilite"
                                {...register("disponibilite")}
                                className={`block w-full px-3 py-2 border ${errors.disponibilite ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                disabled={isLoading}
                            >
                                <option value="true">Disponible</option>
                                <option value="false">Indisponible</option>
                            </select>
                            {errors.disponibilite && <p className="mt-1 text-sm text-red-600">{errors.disponibilite.message}</p>}
                        </div>
                        {/* Restaurant-specific fields */}
                        {typeService === "restauration" && (
                            <div className="space-y-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Détails de Restauration</h3>

                                {/* Menu Items */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Menu <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-3">
                                        {menuItems.map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...menuItems]
                                                        newItems[index] = e.target.value
                                                        setMenuItems(newItems)
                                                    }}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder={`Élément de menu ${index + 1}`}
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeMenuItem(index)}
                                                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                                                    disabled={menuItems.length === 1 || isLoading}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addMenuItem}
                                        className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={isLoading}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Ajouter un élément
                                    </button>
                                    {errors.menu && <p className="mt-1 text-sm text-red-600">{errors.menu.message}</p>}
                                </div>

                                {/* Diet Options */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Options de Régime</label>
                                    <div className="space-y-3">
                                        {dietOptions.map((option, index) => (
                                            <div key={index} className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOptions = [...dietOptions]
                                                        newOptions[index] = e.target.value
                                                        setDietOptions(newOptions)
                                                    }}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder={`Option de régime ${index + 1} (ex: Végétarien)`}
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeDietOption(index)}
                                                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                                                    disabled={dietOptions.length === 1 || isLoading}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addDietOption}
                                        className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={isLoading}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Ajouter une option
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Transport-specific fields */}
                        {typeService === "transport" && (
                            <div className="space-y-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Détails de Transport</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Transport Type */}
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Type de Transport <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="type"
                                            {...register("type")}
                                            className={`block w-full px-3 py-2 border ${errors.type ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                            placeholder="ex: Taxi, Bus, Voiture privée"
                                            disabled={isLoading}
                                        />
                                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                            Durée (minutes) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="duration"
                                            {...register("duration")}
                                            className={`block w-full px-3 py-2 border ${errors.duration ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                            placeholder="60"
                                            min="1"
                                            disabled={isLoading}
                                        />
                                        {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        {...register("date")}
                                        className={`block w-full px-3 py-2 border ${errors.date ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                        disabled={isLoading}
                                    />
                                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-5 border-t border-gray-200">
                            <div className="flex justify-end">
                                <Link
                                    to="/dashboard"
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                >
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Enregistrement...
                                        </div>
                                    ) : (
                                        "Ajouter le Service"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddService