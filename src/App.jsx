import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login, logout } from "./store/authSlice";
import authService from "./appwrite/auth";

import Loader from "./common/Loader";
import DefaultLayout from "./layout/DefaultLayout";
import PageTitle from "./components/PageTitle";
import UploadData from "./pages/Data/UploadData";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import AuthLayout from "./components/Auth/AuthLayout";

function App() {
    const [loading, setLoading] = useState(true);

    // const { pathname } = useLocation();

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, [pathname]);

    const dispatch = useDispatch();

    useEffect(() => {
        authService
            .getCurrentUser()
            .then((userData) => {
                if (userData) {
                    dispatch(login(userData));
                } else {
                    dispatch(logout());
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setTimeout(() => setLoading(false), 1000);
            });
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <div className="w-full min-h-screen flex flex-col">
            <DefaultLayout>
                <Routes>
                    <Route
                        index
                        element={
                            <>
                                <AuthLayout authentication={true}>
                                    <PageTitle title="Mail Genie" />
                                    <h1>Main Page</h1>
                                </AuthLayout>
                            </>
                        }
                    />
                    <Route
                        path="/auth/signin"
                        element={
                            <>
                                <AuthLayout authentication={false}>
                                    <PageTitle title="Sign In | Mail Genie" />
                                    <SignIn />
                                </AuthLayout>
                            </>
                        }
                    />
                    <Route
                        path="/auth/signup"
                        element={
                            <>
                                <AuthLayout authentication={false}>
                                    <PageTitle title="Sign Up |Mail Genie" />
                                    <SignUp />
                                </AuthLayout>
                            </>
                        }
                    />
                    <Route
                        path="/data/upload"
                        element={
                            <>
                                <AuthLayout authentication={true}>
                                    <PageTitle title="Upload Data | Mail Genie" />
                                    <UploadData />
                                </AuthLayout>
                            </>
                        }
                    />
                </Routes>
            </DefaultLayout>
        </div>
    );
}

export default App;
