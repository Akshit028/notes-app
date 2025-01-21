import React from 'react'

const Loading = () => {
    return (
        <div className="p-4 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-gray-900 rounded-full border-t-transparent"></div>
        </div>
    )
}

export default Loading