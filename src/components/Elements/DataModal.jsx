import React from "react";

function DataModal({ data, closeModal }) {
    return (
        <>
            <div
                id="default-modal"
                tabindex="-1"
                aria-hidden="true"
                className="absolute inset-0 z-50 flex justify-center items-start w-full h-full mt-20 overflow-y-auto overflow-x-hidden"
            >
                <div class="relative p-4  w-full max-w-[93rem] max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h1 className="text-black-2">Email Preview</h1>
                            <button
                                type="button"
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="default-modal"
                                onClick={closeModal}
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

                        <div class="p-4 md:p-5 space-y-4">
                            <pre className="text-base leading-relaxed text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                                {data}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DataModal;
