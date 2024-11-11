import React, { useEffect, useState } from "react";
import databaseService from "../../appwrite/database";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "simple-datatables";
import { updateData } from "../../store/authSlice";
import { Link } from "react-router-dom";
import Loader from "../../common/Loader2";
function Preview() {
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const [loading,setLoading]=useState(false);
    useEffect(() => {
        if (
            document.getElementById("pagination-table") &&
            typeof DataTable !== "undefined"
        ) {
            const dataTable = new DataTable("#pagination-table", {
                paging: true,
                perPage: 5,
                perPageSelect: [5, 10, 15, 20, 25],
                sortable: true,
            });
        }
    }, [userData]);

    const handleDelete = async (batchId) => {
        setLoading(true);
        try {
            // Remove the batch with the specified batchId from userData.batches
            const updatedBatches = userData.batches.filter(
                (batch) => batch.$id !== batchId
            );
            const updatedUserData = { ...userData, batches: updatedBatches };

            // Update the user data in the database
            await databaseService.deleteBatch(batchId);
            dispatch(updateData(updatedUserData));
        } catch (error) {
            console.error("Error updating user data:", error);
        } finally{
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <Breadcrumb pageName="Preview" />
            {loading && <Loader/>}
            <div>
                <table id="pagination-table">
                    <thead>
                        <tr>
                            <th>
                                <span class="flex items-center">
                                    Batch Name
                                    <svg
                                        class="w-4 h-4 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                        />
                                    </svg>
                                </span>
                            </th>
                            <th>
                                <span class="flex items-center">
                                    Status
                                    <svg
                                        class="w-4 h-4 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                        />
                                    </svg>
                                </span>
                            </th>
                            <th>
                                <span class="flex items-center">
                                    Created At
                                    <svg
                                        class="w-4 h-4 ms-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                        />
                                    </svg>
                                </span>
                            </th>
                            <th>
                                <span class="flex items-center">
                                    Open Details
                                </span>
                            </th>
                            <th>
                                <span class="flex items-center">
                                    Delete Batch
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.batches.map((batch, index) => (
                            <tr key={index}>
                                <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {batch.name}
                                </td>
                                <td>{batch.status}</td>
                                <td>{formatDate(batch.$createdAt)}</td>
                                <td>
                                    <Link to={`/data/preview/${index}`}>
                                        <button
                                            type="button"
                                            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        >
                                            Open
                                        </button>
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                        onClick={()=>handleDelete(batch.$id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Preview;
