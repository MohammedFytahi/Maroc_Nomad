"use client"

import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

const RegisterForm = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("USER")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const navigate = useNavigate()

    // Check password strength
    const checkPasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 8) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1
        setPasswordStrength(strength)
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        checkPasswordStrength(newPassword)
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const response = await axios.post("/api/auth/register", {
                username,
                email,
                password,
                role,
            })
            console.log(response.data)
            navigate("/login")
        } catch (err) {
            setError("Registration failed: " + (err.response?.data || err.message))
        } finally {
            setIsLoading(false)
        }
    }

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
                return "Very weak"
            case 1:
                return "Weak"
            case 2:
                return "Medium"
            case 3:
                return "Strong"
            case 4:
                return "Very strong"
            default:
                return ""
        }
    }

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
                return "bg-red-500"
            case 1:
                return "bg-orange-500"
            case 2:
                return "bg-yellow-500"
            case 3:
                return "bg-green-500"
            case 4:
                return "bg-green-600"
            default:
                return "bg-gray-200"
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 flex items-center justify-center shadow-lg">
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
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
                    <p className="mt-2 text-sm text-gray-600">Join Maroc 2030 and start your Moroccan adventure</p>
                </div>

                {/* Registration Form */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    className="py-3 pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    placeholder="johndoe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="py-3 pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                    disabled={isLoading}
                                    className="py-3 pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    placeholder="••••••••"
                                />
                            </div>
                            {password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`}
                                                style={{ width: `${passwordStrength * 25}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500 ml-2">{getPasswordStrengthText()}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Password should be at least 8 characters and include uppercase, numbers, and special characters.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    className={`py-3 pl-10 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
                                        confirmPassword && password !== confirmPassword ? "border-red-300" : "border-gray-300"
                                    }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Account Type
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <select
                                    id="role"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    disabled={isLoading}
                                    className="py-3 pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                >
                                    <option value="USER">Traveler (User)</option>
                                    <option value="PROVIDER">Service Provider</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {role === "USER" && "As a traveler, you can browse and book services."}
                                {role === "PROVIDER" && "As a provider, you can list and manage your services."}
                                {role === "ADMIN" && "Administrator accounts require approval."}
                            </p>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || (confirmPassword && password !== confirmPassword)}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
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
                                        Creating account...
                                    </div>
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Login Link */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 hidden lg:block">
                    <div className="w-64 h-64 rounded-full bg-indigo-100 opacity-20"></div>
                </div>
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 hidden lg:block">
                    <div className="w-64 h-64 rounded-full bg-teal-100 opacity-20"></div>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm

