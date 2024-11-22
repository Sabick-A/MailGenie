import React, { useEffect, useState } from "react";
import Login from "./Authentication/Login";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import databaseService from "../appwrite/database";
import { login, logout } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../assets/images/logo/logo-icon.png";
import DarkModeSwitcher from "../components/Header/DarkModeSwitcher";
import DropdownUser from "../components/Header/DropdownUser";
import Loader3 from "../common/Loader3";
function Landing() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { user, isAuthenticated ,isLoading } = useAuth0();
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);
    const checkUser = async () => {
        try {
            setLoading(true);
            if (isAuthenticated && user) {
                let userData = await databaseService.getUser(user.email);
                if (!userData) {
                    userData = await databaseService.createUser({
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                    });
                }
                dispatch(login(userData));
            } else {
                dispatch(logout());
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, [isAuthenticated, user]);
    return (
        <>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
                <div className="flex min-h-screen flex-col">
                    <header>
                        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 w-dvw">
                            <div className="flex flex-wrap justify-between items-center mx-auto ">
                                <div className="flex items-center gap-10">
                                    <Link
                                        className="block flex-shrink-0 "
                                        to="/"
                                    >
                                        <img
                                            width={50}
                                            src={LogoIcon}
                                            alt="Logo"
                                        />
                                    </Link>
                                    <p className="text-2xl hidden font-satoshi md:flex">
                                        MailGenie
                                    </p>
                                </div>

                                <div className="flex items-center justify-end lg:order-1 gap-10 ">
                                    <DarkModeSwitcher />
                                    {authStatus && <DropdownUser />}
                                </div>
                            </div>
                        </nav>
                    </header>
                    <section className="bg-white dark:bg-gray-900 flex items-center flex-grow">
                        <div className="grid py-8 px-6 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 ">
                            <div className="place-self-center mr-auto lg:col-span-7">
                                <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white">
                                    Mailing Just Got Faster
                                </h1>
                                <p className="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                                    From managing inboxes to automating email
                                    campaigns, businesses worldwide trust
                                    MailGenie to streamline their email
                                    workflows.
                                </p>

                                {!isLoading && !loading &&
                                    (authStatus ? (
                                        <button
                                            onClick={() => {
                                                navigate("/app/data/upload");
                                            }}
                                            className="bg-blue-700 w-full text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                                        >
                                            <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                                            Go to App
                                        </button>
                                    ) : (
                                        <Login />
                                    ))}

                                {(isLoading || loading) && <Loader3 />}
                            </div>
                            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                                <img
                                    src="https://img.freepik.com/free-vector/mail-sent-concept-illustration_114360-96.jpg?t=st=1732125538~exp=1732129138~hmac=954342651b6522af5e108d688b8684d42654def0faeb9e4077b6b85d9ce692d5&w=826"
                                    alt="mockup"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Landing;
