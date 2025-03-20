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
        is: (val) => ["restauration", "activite"].includes(val),
        then: () => yup.array().of(yup.string()).min(1, "Au moins un élément de menu requis"),
        otherwise: () => yup.array().optional(),
    }),
    optionRegime: yup.array().when("typeService", {
        is: (val) => ["restauration", "activite"].includes(val),
        then: () => yup.array().of(yup.string()).optional(),
        otherwise: () => yup.array().optional(),
    }),
    type: yup.string().when("typeService", {
        is: (val) => ["transport", "hebergement"].includes(val),
        then: () => yup.string().required("Type requis"),
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
    horaires: yup.array().when("typeService", {
        is: "hebergement",
        then: () => yup.array().of(yup.date()).min(1, "Au moins un horaire requis"),
        otherwise: () => yup.array().optional(),
    }),
    note: yup.number().when("typeService", {
        is: "hebergement",
        then: () => yup.number().min(0, "La note doit être positive ou zéro").max(5, "La note ne peut pas dépasser 5").optional(),
        otherwise: () => yup.number().optional(),
    }),
    dateCalculated: yup.date().when("typeService", {
        is: "hebergement",
        then: () => yup.date().optional(),
        otherwise: () => yup.date().optional(),
    }),
    image: yup.mixed().optional(), // Validation pour l'image (facultative)
})
const AddService = () => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [menuItems, setMenuItems] = useState([""])
    const [dietOptions, setDietOptions] = useState([""])
    const [horaires, setHoraires] = useState([""])
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [imageFile, setImageFile] = useState(null) // État pour l'image
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
            axios
                .get("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
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
    const addMenuItem = () => setMenuItems([...menuItems, ""])
    const removeMenuItem = (index) => {
        const newMenuItems = [...menuItems]
        newMenuItems.splice(index, 1)
        setMenuItems(newMenuItems)
    }

    const addDietOption = () => setDietOptions([...dietOptions, ""])
    const removeDietOption = (index) => {
        const newDietOptions = [...dietOptions]
        newDietOptions.splice(index, 1)
        setDietOptions(newDietOptions)
    }

    const addHoraire = () => setHoraires([...horaires, ""])
    const removeHoraire = (index) => {
        const newHoraires = [...horaires]
        newHoraires.splice(index, 1)
        setHoraires(newHoraires)
    }

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0])
    }


    const onSubmit = async (data) => {
        setIsLoading(true)
        setErrorMessage("")
        setSuccessMessage("")

        const token = localStorage.getItem("token")
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
            providerId: user.id,
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
        } else if (data.typeService === "activite") {
            endpoint = "/api/services/activite"
            serviceData = {
                ...serviceData,
                menu: menuItems.filter((item) => item.trim() !== ""),
                optionRegime: dietOptions.filter((option) => option.trim() !== ""),
            }
        } else if (data.typeService === "hebergement") {
            endpoint = "/api/services/hebergement"
            serviceData = {
                ...serviceData,
                type: data.type,
                horaires: horaires.map((h) => new Date(h)).filter((h) => !isNaN(h.getTime())),
                note: data.note ? parseFloat(data.note) : null,
                dateCalculated: data.dateCalculated ? new Date(data.dateCalculated) : null,
            }
        }

        const formData = new FormData()
        formData.append("service", new Blob([JSON.stringify(serviceData)], { type: "application/json" }))
        if (imageFile) {
            formData.append("image", imageFile)
        }

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Ne définissez PAS "Content-Type" manuellement ici, laissez axios le gérer automatiquement avec multipart/form-data
                },
            })
            setSuccessMessage("Service ajouté avec succès !")
            reset()
            setMenuItems([""])
            setDietOptions([""])
            setHoraires([""])
            setImageFile(null)
            setTimeout(() => {
                navigate("/services")
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

                    {successMessage && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        <div>
                            <label htmlFor="typeService" className="block text-static method text-gray-700 mb-1">
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
                                <option value="activite">Activité</option>
                                <option value="hebergement">Hébergement</option>
                            </select>
                            {errors.typeService && <p className="mt-1 text-sm text-red-600">{errors.typeService.message}</p>}
                        </div>

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

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Image (facultatif)
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={`block w-full px-3 py-2 border ${errors.image ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                disabled={isLoading}
                            />
                            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
                            {imageFile && (
                                <p className="mt-2 text-sm text-gray-600">Fichier sélectionné : {imageFile.name}</p>
                            )}
                        </div>
                        {typeService === "transport" && (
                            <div className="space-y-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Détails de Transport</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Type de Transport <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="type"
                                            {...register("type")}
                                            className={`block w-full px-3 py-2 border ${errors.type ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                            placeholder="ex: Taxi, Bus"
                                            disabled={isLoading}
                                        />
                                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                                    </div>
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
                        {typeService === "restauration" && (
                            <div className="space-y-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Détails de Restauration</h3>
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Ajouter un élément
                                    </button>
                                    {errors.menu && <p className="mt-1 text-sm text-red-600">{errors.menu.message}</p>}
                                </div>
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
                                                    placeholder={`Option de régime ${index + 1}`}
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeDietOption(index)}
                                                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                                                    disabled={dietOptions.length === 1 || isLoading}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Ajouter une option
                                    </button>
                                </div>
                            </div>
                        )}
                        {typeService === "activite" && (
                            <div className="space-y-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Détails de l'Activité</h3>
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Ajouter un élément
                                    </button>
                                    {errors.menu && <p className="mt-1 text-sm text-red-600">{errors.menu.message}</p>}
                                </div>
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
                                                    placeholder={`Option de régime ${index + 1}`}
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeDietOption(index)}
                                                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                                                    disabled={dietOptions.length === 1 || isLoading}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Ajouter une option
                                    </button>
                                </div>
                            </div>
                        )}
                        {typeService === "hebergement" && (
                            <div className="space-y-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-medium text-gray-900">Détails de l'Hébergement</h3>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                        Type d'Hébergement <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="type"
                                        {...register("type")}
                                        className={`block w-full px-3 py-2 border ${errors.type ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                        placeholder="ex: Hôtel, Riad"
                                        disabled={isLoading}
                                    />
                                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Horaires <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-3">
                                        {horaires.map((horaire, index) => (
                                            <div key={index} className="flex items-center">
                                                <input
                                                    type="datetime-local"
                                                    value={horaire}
                                                    onChange={(e) => {
                                                        const newHoraires = [...horaires]
                                                        newHoraires[index] = e.target.value
                                                        setHoraires(newHoraires)
                                                    }}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeHoraire(index)}
                                                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                                                    disabled={horaires.length === 1 || isLoading}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addHoraire}
                                        className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={isLoading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Ajouter un horaire
                                    </button>
                                    {errors.horaires && <p className="mt-1 text-sm text-red-600">{errors.horaires.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                                            Note (0-5)
                                        </label>
                                        <input
                                            type="number"
                                            id="note"
                                            {...register("note")}
                                            className={`block w-full px-3 py-2 border ${errors.note ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                            placeholder="4.5"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            disabled={isLoading}
                                        />
                                        {errors.note && <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="dateCalculated" className="block text-sm font-medium text-gray-700 mb-1">
                                            Date Calculée
                                        </label>
                                        <input
                                            type="date"
                                            id="dateCalculated"
                                            {...register("dateCalculated")}
                                            className={`block w-full px-3 py-2 border ${errors.dateCalculated ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                            disabled={isLoading}
                                        />
                                        {errors.dateCalculated && <p className="mt-1 text-sm text-red-600">{errors.dateCalculated.message}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                className={`inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                                    isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
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
                                ) : null}
                                {isLoading ? "Ajout en cours..." : "Ajouter le Service"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddService