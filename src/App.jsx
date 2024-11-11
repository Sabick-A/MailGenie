import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login, logout ,updateData } from "./store/authSlice";
import authService from "./appwrite/auth";
import databaseService from "./appwrite/database";

import Loader from "./common/Loader";
import DefaultLayout from "./layout/DefaultLayout";
import PageTitle from "./components/PageTitle";
import UploadData from "./pages/Data/UploadData";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import AuthLayout from "./components/Auth/AuthLayout";
import Preview from "./pages/Data/Preview";
import BatchPreview from "./pages/Data/BatchPreview";
function App() {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const checkUser = async () => {
        try {
            const user = await authService.getCurrentUser();
            if (user) {
                const userData = await databaseService.getUser(user.$id);
                dispatch(login(userData));
            } else {
                dispatch(logout());
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        checkUser();
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
                    <Route
                        path="/data/preview"
                        element={
                            <>
                                <AuthLayout authentication={true}>
                                    <PageTitle title="Preview | Mail Genie" />
                                    <Preview/>
                                </AuthLayout>
                            </>
                        }
                    />
                    <Route
                        path="/data/preview/:batchIndex"
                        element={
                            <>
                                <AuthLayout authentication={true}>
                                    <PageTitle title="Generate Email | Mail Genie" />
                                    <BatchPreview />
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
