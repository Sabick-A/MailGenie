import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import { updateData } from "../store/authSlice"; 
import databaseService from "../appwrite/database";
import Loader from "../common/Loader2/index.jsx";
import { useState } from "react";


const Profile = () => {
    const userData = useSelector((state) => state.auth.userData);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        getValues,
        formState: { errors } ,
        reset,
        // Add reset
    } = useForm({
        defaultValues: {
            name: userData.name,
            profession: userData.profession,
            organization: userData.organization,
            bio: userData.bio,
        },
    });
    
    const dispatch=useDispatch();
    const saveData = async (data) => {
        try {
            setLoading(true);
            data.status=true;
            const updatedUser = await databaseService.updateUser(userData.$id, data);
            console.log(updatedUser);
            dispatch(updateData(updatedUser));
            reset(updatedUser);
        } catch (error) {
            console.log("error: ", error);
        }finally{
            setLoading(false);
        }
    };
    return (
        <>
            {loading && <Loader />}
            <Breadcrumb pageName="Profile" />

            <div className="w-full">
                <div className="p-2 md:p-4">
                    <form className="w-full p-5 mt-3 sm:rounded-lg bg-white dark:bg-boxdark rounded-md" onSubmit={handleSubmit(saveData)}>
                        <div className="grid mx-auto mt-8">
                            <div className="drop-shadow-2 relative z-30 mx-auto -mt-22 h-30 w-full rounded-full max-w-30  bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3d">
                                <img src={userData.picture} alt="profile" className="w-full rounded-full" />
                                {/* <label
                                    htmlFor="profile"mx-auto
                                    className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                                >
                                    <svg
                                        className="fill-current"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                                            fill=""
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                                            fill=""
                                        />
                                    </svg>
                                    <input
                                        type="file"
                                        name="profile"
                                        id="profile"
                                        className="sr-only"
                                    />
                                </label> */}
                            </div>

                            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                    <div className="w-full">
                                        <label
                                            for="name"
                                            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                                        >
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            placeholder="Your name"
                                            {...register("name", {
                                                required: "Name is required",
                                            })}
                                        />
                                        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
                                    </div>
                                </div>

                                <div className="mb-2 sm:mb-6">
                                    <label
                                        for="email"
                                        className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                                    >
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        placeholder="your.email@mail.com"
                                        value={userData.email}
                                        disabled
                                    />
                                </div>

                                <div className="mb-2 sm:mb-6">
                                    <label
                                        for="profession"
                                        className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                                    >
                                        Profession
                                    </label>
                                    <input
                                        type="text"
                                        id="profession"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        placeholder="your profession"
                                        {...register("profession", {
                                            required: "Profession is required",
                                        })}
                                    />
                                    {errors.profession && <p className="text-red-600">{errors.profession.message}</p>}
                                </div>
                                <div className="mb-2 sm:mb-6">
                                    <label
                                        for="organization"
                                        className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                                    >
                                        Organization
                                    </label>
                                    <input
                                        type="text"
                                        id="organization"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        placeholder="your Organization"
                                        {...register("organization", {
                                            required: "Organization is required",
                                        })}
                                    />
                                    {errors.organization && <p className="text-red-600">{errors.organization.message}</p>}
                                </div>
                                <div className="mb-6">
                                    <label
                                        for="bio"
                                        className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                                    >
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        rows="4"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        placeholder="Write your bio here..."
                                        {...register("bio", {
                                            required: "Bio is Required",
                                        })}
                                    ></textarea>
                                    {errors.bio && <p className="text-red-600">{errors.bio.message}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile;
