import React from 'react';

// Card Skeleton
export const CardSkeleton: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-[#252526] to-[#1e1e1e] p-6 rounded-xl border border-[#333] shadow-lg animate-pulse">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#333] rounded-xl"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-3 bg-[#333] rounded w-1/4"></div>
                    <div className="h-8 bg-[#333] rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
};

// Text Skeleton
export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
    return (
        <div className="space-y-2 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-[#333] rounded"
                    style={{ width: i === lines - 1 ? '60%' : '100%' }}
                ></div>
            ))}
        </div>
    );
};

// List Skeleton
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => {
    return (
        <div className="space-y-2">
            {Array.from({ length: items }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-[#1e1e1e] border border-[#333] rounded-lg animate-pulse"
                >
                    <div className="w-5 h-5 bg-[#333] rounded"></div>
                    <div className="flex-1 h-4 bg-[#333] rounded"></div>
                </div>
            ))}
        </div>
    );
};

// Chart Skeleton
export const ChartSkeleton: React.FC = () => {
    return (
        <div className="bg-[#252526] rounded-xl border border-[#333] p-6 shadow-lg animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div className="h-5 bg-[#333] rounded w-1/4"></div>
                <div className="h-8 bg-[#333] rounded w-24"></div>
            </div>
            <div className="h-64 bg-[#1e1e1e] rounded flex items-end justify-around p-4 gap-2">
                {[40, 60, 45, 75, 55, 80, 65].map((height, i) => (
                    <div
                        key={i}
                        className="bg-[#333] rounded-t w-full"
                        style={{ height: `${height}%` }}
                    ></div>
                ))}
            </div>
        </div>
    );
};
