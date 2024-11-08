const Loader = () => {
    return (
        <>
            <div className="fixed inset-0 flex items-center h-screen justify-center z-50">
                <div className="absolute inset-0 m-auto h-70 w-100 flex flex-col items-center justify-center bg-slate-200 bg-opacity-95 gap-10 rounded-xl">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    <h1 className="text-2xl">Loading...</h1>
                </div>
            </div>
        </>
    );
};

export default Loader;
