import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ErrorModal from "../../components/Elements/ErrorModal";
import { useSelector } from "react-redux";
import SelectOne from "../../components/FormElements/SelectOne";

function EmailGenerator() {
    const [error, setError] = useState("");
    const { register, handleSubmit } = useForm();
    const [selectedOption, setSelectedOption] = useState("");
    const [options, setOptions] = useState({});
    const userData = useSelector((state) => state.auth.userData);
    const closeModal = () => {
        setError(null);
    };

    useEffect(() => {
        const newOptions = {};
        userData.batches.forEach((batch) => {
            newOptions[batch.name] = batch.$id;
        });
        setOptions(newOptions);
    }, [userData]);

    return (
        <>
            <Breadcrumb pageName="Email Generator" />
            {error && <ErrorModal {...{ error, closeModal }} />}
            <form action="">
                <div className="flex flex-col rounded-sm border w-11/12 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5 gap-5">
                    <div>
                        <SelectOne
                            label={"Select Your Batch"}
                            options={options}
                            setSelectedOption={setSelectedOption}
                            selectedOption={selectedOption}
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Fetch Data
                    </button>
                </div>
            </form>
        </>
    );
}

export default EmailGenerator;
