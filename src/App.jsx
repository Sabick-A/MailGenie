import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login, logout } from "./store/authSlice";
import databaseService from "./appwrite/database";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "./common/Loader";
import DefaultLayout from "./layout/DefaultLayout";
import PageTitle from "./components/PageTitle";
import UploadData from "./pages/Data/UploadData";
import Login from "./pages/Authentication/Login";
import AuthLayout from "./components/Auth/AuthLayout";
import Preview from "./pages/Data/Preview";
import BatchPreview from "./pages/Data/BatchPreview";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";

const appPageMaker = (title, children) => {
    return (
        <DefaultLayout>
            <AuthLayout authentication={true}>
                <PageTitle title={title} />
                {children}
            </AuthLayout>
        </DefaultLayout>
    );
};

function App() {
    return(
        <div className="w-full min-h-screen flex flex-col">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route
                        path="/profile"
                        element={
                            <>
                                <AuthLayout authentication={true}>
                                    {appPageMaker("profile", <Profile />)}
                                </AuthLayout>
                            </>
                        }
                    />
                    <Route
                        path="/app/data/upload"
                        element={
                            <>
                                {appPageMaker(
                                    "Upload Data | Mail Genie",
                                    <UploadData />
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/app/data/preview"
                        element={
                            <>
                                {appPageMaker(
                                    "Preview | Mail Genie",
                                    <Preview />
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/app/data/preview/:batchIndex"
                        element={
                            <>
                                {appPageMaker(
                                    "Generate Email | Mail Genie",
                                    <BatchPreview />
                                )}
                            </>
                        }
                    />
                </Routes>
        </div>
    );
}

export default App;
