import React, { useEffect, useRef, useState } from "react";
import { set, useForm } from "react-hook-form";
import { parseCsv } from "../../utils/FormData/parseCsv.js";
import databaseService from "../../appwrite/database.js";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import SelectOne from "../../components/FormElements/SelectOne";
import ErrorModal from "../../components/Elements/ErrorModal";
import { updateData } from "../../store/authSlice.js";
import DataTable from "../../components/Data/DataTable.jsx";

import promptSuggester from "../../utils/Groq/promptSuggester.js";
import processEntries from "../../utils/Groq/processEntries.js";
import Loader from "../../common/Loader2/index.jsx";
import extractKeys from "../../utils/FormData/extractKeys.js";
import { useNavigate } from "react-router-dom";

function UploadData() {
    const [selectedOption, setSelectedOption] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [parsedData, setParsedData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.auth.userData);
    const [promptTemplates, setPromptTemplates] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const closeModal = () => {
        setError(null);
    };

    const handleData = async () => {
        setError(null);
        setParsedData(null);
        if (selectedOption === "csv") {
            const file = getValues("csvFile")[0];
            if (file) {
                try {
                    const response = await parseCsv(file);
                    response.name = getValues("name");
                    response.userId = userData.$id;
                    response.columns = extractKeys(response.data).filter(
                        (column) => column !== "email"
                    );
                    setParsedData(response);
                } catch (error) {
                    setError(error.message);
                }
            } else {
                setError("Please upload a CSV file");
            }
        }
        if (selectedOption === "gsheet") {
            setError("Google Sheets URL is not supported yet");
            // if (selectedOption === "gsheet") {
            //         const url = data.gSheetUrl;
            //         if (url) {
            //             const spreadsheetId = url.split("/d/")[1].split("/")[0];
            //             console.log(spreadsheetId);
            //         } else {
            //             setError("Please enter a Google Sheets URL");
            //         }
            //     }
        }
    };

    const saveData = async (data) => {
        setError(null);
        setLoading(true);
        try {
            for (const column of parsedData.columns) {
                if (!data.prompt.includes(`{${column}}`)) {
                    throw new Error(`Prompt is missing {${column}}`);
                }
            }
            const processedData = await processEntries(parsedData, data.prompt);
            const batch = await databaseService.createBatch({
                data: processedData.data,
                name: data.name,
                prompt: data.prompt,
            });
            if (batch) {
                const updatedUserData = { ...userData };
                updatedUserData.batches = updatedUserData.batches
                    ? [...updatedUserData.batches, batch.$id]
                    : [batch.$id];

                const updatedData = await databaseService.updateUser(
                    userData.$id,
                    { batches: updatedUserData.batches }
                );

                dispatch(updateData(updatedData));
                reset(); // Reset the form after successful submission
                setParsedData(null);
            }
        } catch (error) {
            console.error("Error saving data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const options = {
        "Csv File Upload": "csv",
        "Google Sheets Url": "gsheet",
    };

    const textareaRef = useRef(null);
    const handleButtonClick = (column) => {
        const textarea = textareaRef.current;
        const cursorPos = textarea.selectionStart;
        const currentValue = textarea.value;

        // Insert the column text at the cursor position
        const newValue =
            currentValue.slice(0, cursorPos) +
            `{${column}}` +
            currentValue.slice(cursorPos);

        // Update the textarea value
        textarea.value = newValue;

        // Update the form state if needed
        setValue("prompt", newValue);

        // Move the cursor to the end of the inserted text
        textarea.setSelectionRange(
            cursorPos + `{{${column}}}`.length,
            cursorPos + `{{${column}}}`.length
        );
        textarea.focus();
    };
    const navigate = useNavigate();

    const getTemplates = async () => {
        try {
            setLoading(true);
            const res = await promptSuggester(userData, parsedData.column);
            setPromptTemplates(res);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("Failed to get prompt suggestions.. Try Again");
        }
    };



    const handleNextStep = () => {
        if (selectedTitle) {
            setValue("prompt", promptTemplates[selectedTitle]);
            setPromptTemplates(null);
        } else {
            console.log("No title selected");
        }
    };

    return (
        <>
            {loading && <Loader />}
            <Breadcrumb pageName="Upload Data" />
            {!userData.status && (
                <ErrorModal
                    error="Update Your Profile to Continue"
                    closeModal={() => navigate("/profile")}
                />
            )}

            {promptTemplates && (
                <div
                    id="select-modal"
                    tabindex="-1"
                    aria-hidden="true"
                    class="overflow-y-auto overflow-x-hidden fixed inset-0 flex justify-center items-center z-[1000] w-full h-full"
                >
                    <div class="relative p-4 lg:pl-80 w-full max-h-full">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                    Prompt Suggestions
                                </h3>
                                <button
                                    type="button"
                                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-toggle="select-modal"
                                    onClick={() => setPromptTemplates(null)}
                                >
                                    <svg
                                        class="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>

                            <div class="p-4 md:p-5">
                                <p class="text-gray-500 dark:text-gray-400 mb-4">
                                    Select your desired Prompt Template:
                                </p>
                                <ul class="space-y-4 mb-4">
                                    {Object.entries(promptTemplates).map(
                                        ([title, prompt]) => (
                                            <li key={title}>
                                                <input
                                                    type="radio"
                                                    id={title}
                                                    name="prompts"
                                                    value={title}
                                                    class="hidden peer"
                                                    required
                                                />
                                                <label
                                                    for={title}
                                                    class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
                                                    onClick={()=>setSelectedTitle(title)}
                                                >
                                                    <div class="block">
                                                        <div class="w-full text-lg font-semibold">
                                                            {title}
                                                        </div>
                                                        <div class="w-full text-gray-500 dark:text-gray-400">
                                                            {prompt}
                                                        </div>
                                                    </div>
                                                    <svg
                                                        class="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 14 10"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M1 5h12m0 0L9 1m4 4L9 9"
                                                        />
                                                    </svg>
                                                </label>
                                            </li>
                                        )
                                    )}
                                </ul>
                                <button onClick={handleNextStep} class="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    USE THIS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {error && <ErrorModal {...{ error, closeModal }} />}
            <form onSubmit={handleSubmit(saveData)}>
                <div className="flex flex-col rounded-sm border w-11/12 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5 gap-5">
                    <div>
                        <label className="mb-3 block text-black dark:text-white">
                            Give A Name for the Data
                        </label>
                        <input
                            type="text"
                            placeholder="Data Name"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                        {errors.name && (
                            <p className="text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <SelectOne
                        label={"Select Upload Source"}
                        options={options}
                        setSelectedOption={setSelectedOption}
                        selectedOption={selectedOption}
                    />
                    {selectedOption === "csv" && (
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Attach CSV file
                            </label>
                            <input
                                type="file"
                                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                {...register("csvFile")}
                            />
                        </div>
                    )}

                    {selectedOption === "gsheet" && (
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Enter Google Sheets URL
                            </label>
                            <input
                                type="text"
                                placeholder="Google Sheet Url"
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                {...register("gSheetUrl")}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <button
                            onClick={handleData}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                        >
                            Fetch Data
                        </button>
                        {parsedData && (
                            <button
                                onClick={() => setShowPreview((prev) => !prev)}
                                type="button"
                                className="inline-flex items-center justify-center rounded-md bg-blue-400 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                            >
                                {showPreview ? "Hide Preview" : "Show Preview"}
                            </button>
                        )}
                    </div>
                    {parsedData && (
                        <>
                            <div>
                                <div className="flex justify-between items-center">
                                    <label className="mb-3 block text-black dark:text-white">
                                        Enter Your Custom Prompt
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => getTemplates()}
                                        class="relative list-none flex items-center justify-center border-0 bg-transparent dark:bg-green-200  bg-blue-300 m-3 dark:text-black-2  rounded-full  py-3 px-6 text-xs font-medium text-white hover:bg-opacity-90 space-x-5"
                                    >
                                        <span class="relative flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="2em"
                                                viewBox="0 0 384 512"
                                                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-yellow-500 opacity-0 transition-opacity duration-300 hover:opacity-100"
                                            >
                                                <path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"></path>
                                            </svg>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="2em"
                                                viewBox="0 0 384 512"
                                                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:fill-yellow-500"
                                            >
                                                <path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7l0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5H109c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8l0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4l0 0 0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5H226.4c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8l0 0 0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80V416H272v16c0 44.2-35.8 80-80 80z"></path>
                                            </svg>
                                        </span>
                                        <span class="ml-2">
                                            GET SUGGESTIONS
                                        </span>
                                    </button>
                                </div>

                                <textarea
                                    rows={6}
                                    placeholder="Enter Your Prompt . Include the Columns in the Prompt By clicking the buttons below"
                                    maxLength={1000}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("prompt", {
                                        required: "Prompt is required",
                                    })}
                                    ref={(e) => {
                                        textareaRef.current = e; // Set the ref manually
                                        register("prompt").ref(e); // Also pass to react-hook-form
                                    }}
                                ></textarea>
                                {errors.prompt && (
                                    <p className="text-red-600">
                                        {errors.prompt.message}
                                    </p>
                                )}
                                <div className="flex gap-5 flex-wrap my-5">
                                    {parsedData.columns.map((column, index) => (
                                        <button
                                            onClick={() =>
                                                handleButtonClick(column)
                                            }
                                            span
                                            key={index}
                                            type="button"
                                            className="inline-flex items-center justify-center rounded-md bg-blue-400 py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                        >
                                            {column}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                            >
                                Submit
                            </button>
                        </>
                    )}
                </div>
            </form>

            {showPreview && parsedData && (
                <>
                    <div className="mt-10  w-full">
                        <h2 className="mb-6 text-2xl font-semibold text-black dark:text-white">
                            Data Preview
                        </h2>
                        <DataTable parsedData={parsedData} />
                    </div>
                </>
            )}
        </>
    );
}

export default UploadData;
