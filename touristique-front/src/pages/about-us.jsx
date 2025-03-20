"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

const AboutUs = () => {
    const heroRef = useRef(null)
    const missionRef = useRef(null)
    const valuesRef = useRef(null)

    useEffect(() => {
        // Animation pour l'entrée des éléments
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -100px 0px",
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-in")
                    observer.unobserve(entry.target)
                }
            })
        }, observerOptions)

        const elements = document.querySelectorAll(".animate-on-scroll")
        elements.forEach((el) => {
            observer.observe(el)
        })

        // Effet de parallaxe pour le héro
        const handleScroll = () => {
            if (heroRef.current) {
                const scrollPos = window.scrollY
                heroRef.current.style.transform = `translateY(${scrollPos * 0.4}px)`
                heroRef.current.style.opacity = 1 - scrollPos * 0.002
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            observer.disconnect()
        }
    }, [])

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Hero Section avec effet parallaxe */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Overlay de couleur avec dégradé */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70 z-10"></div>

                {/* Image de fond avec effet parallaxe */}
                <div ref={heroRef} className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"></div>
                </div>

                {/* Contenu du héro */}
                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
              Découvrez le Maroc Authentique
            </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        La première plateforme qui connecte les voyageurs avec des expériences locales uniques
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/services"
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
                        >
                            Explorer nos services
                        </Link>
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-transparent border-2 border-white rounded-full text-white font-medium hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Rejoindre la communauté
                        </Link>
                    </div>
                </div>

                {/* Flèche de défilement */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </div>

            {/* Section Notre Plateforme */}
            <div className="relative py-24 bg-gradient-to-b from-black to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="animate-on-scroll opacity-0 transition-all duration-1000 transform translate-y-10"
                        ref={missionRef}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                  Notre Plateforme
                </span>
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25"></div>
                                <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                                    <img
                                        src="/placeholder.svg?height=600&width=800"
                                        alt="Expérience marocaine"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">Une Nouvelle Façon de Voyager</h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Notre plateforme révolutionne l'expérience de voyage au Maroc en connectant directement les voyageurs
                                    avec des prestataires de services locaux authentiques et vérifiés.
                                </p>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Que vous recherchiez un hébergement unique, un transport fiable ou une expérience gastronomique
                                    inoubliable, notre technologie innovante vous permet de découvrir, réserver et payer en toute
                                    simplicité.
                                </p>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Nous éliminons les intermédiaires traditionnels pour offrir une expérience plus transparente, plus
                                    abordable et plus enrichissante pour les voyageurs comme pour les prestataires locaux.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Notre Mission */}
            <div className="relative py-24 bg-gradient-to-b from-indigo-950 to-black">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute h-96 w-96 -top-48 -right-48 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
                    <div className="absolute h-96 w-96 top-1/2 -left-48 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div
                        className="animate-on-scroll opacity-0 transition-all duration-1000 transform translate-y-10"
                        ref={valuesRef}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  Notre Mission
                </span>
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative p-8 bg-black rounded-lg h-full flex flex-col">
                                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">Connecter</h3>
                                    <p className="text-gray-300 flex-grow">
                                        Créer des liens directs entre les voyageurs et les prestataires de services locaux, favorisant des
                                        échanges culturels authentiques et des retombées économiques équitables.
                                    </p>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative p-8 bg-black rounded-lg h-full flex flex-col">
                                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-white"
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
                                    <h3 className="text-xl font-bold text-white mb-4">Simplifier</h3>
                                    <p className="text-gray-300 flex-grow">
                                        Rendre l'organisation d'un voyage au Maroc simple et sans stress, grâce à une technologie intuitive
                                        qui centralise toutes les réservations et paiements en un seul endroit.
                                    </p>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative p-8 bg-black rounded-lg h-full flex flex-col">
                                    <div className="p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">Préserver</h3>
                                    <p className="text-gray-300 flex-grow">
                                        Promouvoir un tourisme responsable qui respecte et préserve le patrimoine culturel et naturel du
                                        Maroc, tout en soutenant les communautés locales et leurs traditions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 text-center">
                            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                                Notre vision est de devenir la référence incontournable pour tous ceux qui souhaitent découvrir le Maroc
                                de manière authentique, responsable et personnalisée.
                            </p>
                            <Link
                                to="/services"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                            >
                                Commencer l'aventure
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Style global pour les animations */}
            <style jsx global>{`
        .animate-on-scroll {
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
        </div>
    )
}

export default AboutUs

