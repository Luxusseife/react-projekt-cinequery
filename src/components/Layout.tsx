import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { defaultOptions } from "../helpers/toastHelper";

const Layout = () => {
    return (
        <>
            <ToastContainer
                position={defaultOptions.position}
                autoClose={defaultOptions.autoClose}
                pauseOnHover={defaultOptions.pauseOnHover}
                style={defaultOptions.style}
            />

            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    )
}

export default Layout