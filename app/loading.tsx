import React from "react";

const Loading = () => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
        </div>
    );
};

export default Loading;
