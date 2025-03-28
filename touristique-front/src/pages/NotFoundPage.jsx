import { Link } from "react-router-dom"

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6">
                    <svg className="h-16 w-16 text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Page non trouvée</h1>
                <p className="text-gray-600 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
                <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage

