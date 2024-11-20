import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { parseCsv } from "../../utils/FormData/parseCsv.js";
import databaseService from "../../appwrite/database.js";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import SelectOne from "../../components/FormElements/SelectOne";
import ErrorModal from "../../components/Elements/ErrorModal";
import { updateData } from "../../store/authSlice.js";
import DataTable from "../../components/Data/DataTable.jsx";

import processEntries from "../../utils/Groq/processEntries.js";
import Loader from "../../common/Loader2/index.jsx";
import extractKeys from "../../utils/FormData/extractKeys.js";

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
                    console.log(response.data);
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
                if (!data.prompt.includes(`{{${column}}}`)) {
                    throw new Error(`Prompt is missing {{${column}}}`);
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
                console.log("Data saved successfully");
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

    return (
        <>
            {loading && <Loader />}
            <Breadcrumb pageName="Upload Data" />
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
                                <label className="mb-3 block text-black dark:text-white">
                                    Enter Your Custom Prompt
                                </label>
                                <textarea
                                    rows={6}
                                    placeholder="Enter Your Prompt . Include the Columns in the Prompt By clicking the buttons below"
                                    maxLength={1000}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("prompt", {
                                        required: "Prompt is required",
                                    })}
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
                                                setValue(
                                                    "prompt",
                                                    getValues("prompt") +
                                                        `{{${column}}}`
                                                )
                                            }
                                            span
                                            key={index}
                                            type="button"
                                            className="inline-flex items-center justify-center rounded-md bg-blue-400 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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
