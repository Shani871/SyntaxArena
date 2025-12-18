import React, { useEffect, useRef } from 'react';
import { Camera, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';

interface ProctoringCameraProps {
    faceCount: number;
    violations: number;
    maxViolations: number;
    status: 'idle' | 'initializing' | 'active' | 'violation' | 'disqualified';
    onVideoRef: (video: HTMLVideoElement) => void;
    stream?: MediaStream | null;
}

export const ProctoringCamera: React.FC<ProctoringCameraProps> = ({
    faceCount,
    violations,
    maxViolations,
    status,
    onVideoRef,
    stream,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            onVideoRef(videoRef.current);
            if (stream) {
                videoRef.current.srcObject = stream;
            }
        }
    }, [onVideoRef, stream]);

    const getBorderColor = () => {
        if (status === 'disqualified') return 'border-red-600';
        if (status === 'violation') return 'border-yellow-500';
        if (faceCount === 1) return 'border-green-500';
        if (faceCount === 0) return 'border-yellow-500';
        return 'border-red-500';
    };

    const getStatusIcon = () => {
        if (status === 'initializing') {
            return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
        }
        if (status === 'disqualified') {
            return <XCircle size={16} className="text-red-500" />;
        }
        if (faceCount === 1) {
            return <CheckCircle size={16} className="text-green-400" />;
        }
        return <AlertTriangle size={16} className="text-yellow-400" />;
    };

    return (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
            {/* Violation Counter */}
            {violations > 0 && (
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${violations >= maxViolations - 1 ? 'bg-red-500/90' : 'bg-yellow-500/90'
                    } backdrop-blur-sm shadow-lg`}>
                    <AlertTriangle size={14} />
                    <span>Violations: {violations}/{maxViolations}</span>
                </div>
            )}

            {/* Camera Preview */}
            <div className={`relative rounded-xl overflow-hidden border-3 ${getBorderColor()} shadow-2xl transition-all duration-300`}
                style={{ width: '160px', height: '120px' }}>

                {/* Video Feed */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />

                {/* Overlay for status */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                {/* Status Bar */}
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        {getStatusIcon()}
                        <span className="text-[10px] font-bold text-white">
                            {status === 'initializing' ? 'Loading...' :
                                faceCount === 1 ? '1 Face' :
                                    faceCount === 0 ? 'No Face' :
                                        `${faceCount} Faces`}
                        </span>
                    </div>
                    <Eye size={12} className="text-white/60" />
                </div>

                {/* Proctoring Badge */}
                <div className="absolute top-1 left-1 flex items-center gap-1 px-1.5 py-0.5 bg-black/50 rounded text-[8px] font-bold text-white uppercase tracking-wider">
                    <Camera size={10} />
                    <span>Proctored</span>
                </div>

                {/* Pulse Animation for Active Status */}
                {status === 'active' && faceCount === 1 && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}

                {/* Warning Pulse for Violation */}
                {(status === 'violation' || faceCount !== 1) && status !== 'initializing' && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
            </div>
        </div>
    );
};
