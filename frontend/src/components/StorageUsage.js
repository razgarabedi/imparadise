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
        <div className="p-4 bg-background-muted rounded-lg border border-border w-5/6 mx-auto">
            <h3 className="text-lg font-semibold text-text mb-2">Storage Usage</h3>
            <div className="w-full bg-background rounded-full h-4 border border-border">
                <div
                    className="bg-accent h-4 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-sm text-muted mt-2 text-center">
                {used} of {limit} used
            </p>
        </div>
    );
};

export default StorageUsage; 