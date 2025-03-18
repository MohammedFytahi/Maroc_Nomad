import { Outlet } from "react-router-dom"
import Navbar from "./navbar"

const Layout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
            <Navbar />
            <div className="pt-20 md:pt-24">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout

