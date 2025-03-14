import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";


// Nedan är admin skyddad resurs som endast är åtkomlig efter inloggning.
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/item/:id",
                element: <DetailPage />
            },
            {
                path: "/mypage",
                element:
                    <ProtectedRoute>
                        <MyPage />
                    </ProtectedRoute>
            },
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/register",
                element: <RegistrationPage />
            }
        ]
    }
]);

export default router;