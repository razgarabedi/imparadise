import React from 'react';

const StorageUsage = ({ storageUsed, storageLimit }) => {
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const used = formatBytes(storageUsed);
    const limit = formatBytes(storageLimit);
    const percentage = storageLimit > 0 ? (storageUsed / storageLimit) * 100 : 0;

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Storage Usage</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {used} of {limit} used
            </p>
        </div>
    );
};

export default StorageUsage; 