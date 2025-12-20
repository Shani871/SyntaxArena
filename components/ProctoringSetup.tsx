import React, { useEffect, useRef, useState } from 'react';
import { Camera, Shield, CheckCircle, AlertTriangle, XCircle, Users, User, Loader } from 'lucide-react';

interface ProctoringSetupProps {
    onReady: () => void;
    onCancel: () => void;
    onVideoRef: (video: HTMLVideoElement) => void;
    startProctoring: () => Promise<boolean>;
    hasPermission: boolean;
    faceCount: number;
    status: string;
    errorMessage: string | null;
}

export const ProctoringSetup: React.FC<ProctoringSetupProps> = ({
    onReady,
    onCancel,
    onVideoRef,
    startProctoring,
    hasPermission,
    faceCount,
    status,
    errorMessage,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [permissionRequested, setPermissionRequested] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            onVideoRef(videoRef.current);
        }
    }, [onVideoRef]);

    const handleStartProctoring = async () => {
        setIsInitializing(true);
        setPermissionRequested(true);
        const success = await startProctoring();
        setIsInitializing(false);

        if (success && videoRef.current) {
            onVideoRef(videoRef.current);
        }
    };

    const canStart = hasPermission && faceCount === 1 && status === 'active';

    const getFaceStatus = () => {
        if (!hasPermission || status === 'initializing') {
            return { icon: <Loader size={20} className="animate-spin" />, text: 'Initializing...', color: 'text-gray-400' };
        }
        if (faceCount === 0) {
            return { icon: <AlertTriangle size={20} />, text: 'No face detected', color: 'text-yellow-400' };
        }
        if (faceCount === 1) {
            return { icon: <CheckCircle size={20} />, text: 'Ready! 1 face detected', color: 'text-green-400' };
        }
        return { icon: <Users size={20} />, text: `${faceCount} faces detected`, color: 'text-red-400' };
    };

    const faceStatus = getFaceStatus();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="bg-[#18181b] border border-[#333] rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-cyber-purple/20 rounded-xl flex items-center justify-center">
                        <Shield size={24} className="text-cyber-purple" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Proctoring Required</h2>
                        <p className="text-sm text-gray-400">Camera verification for fair play</p>
                    </div>
                </div>

                {/* Camera Preview */}
                <div className="relative rounded-xl overflow-hidden bg-[#0f0f10] mb-6 aspect-video">
                    {hasPermission ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                            {/* Face Detection Overlay */}
                            <div className="absolute inset-0 border-4 border-dashed border-gray-600 m-8 rounded-lg opacity-50" />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                <div className={`px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm flex items-center gap-2 ${faceStatus.color}`}>
                                    {faceStatus.icon}
                                    <span className="text-sm font-bold">{faceStatus.text}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                            <Camera size={48} className="text-gray-600" />
                            {errorMessage ? (
                                <div className="text-center px-4">
                                    <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Camera preview will appear here</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Rules */}
                <div className="bg-[#0f0f10] rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-yellow-400" />
                        Proctoring Rules
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                            <User size={14} className="mt-0.5 text-cyber-blue shrink-0" />
                            <span>Only <strong className="text-white">you</strong> should be visible in the camera</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Camera size={14} className="mt-0.5 text-cyber-blue shrink-0" />
                            <span>Stay <strong className="text-white">in frame</strong> throughout the test</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <XCircle size={14} className="mt-0.5 text-red-400 shrink-0" />
                            <span><strong className="text-white">4 violations</strong> = automatic disqualification</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 bg-[#27272a] hover:bg-[#333] text-white text-sm font-bold rounded-xl transition-colors"
                    >
                        Exit to Home
                    </button>

                    {!permissionRequested ? (
                        <button
                            onClick={handleStartProctoring}
                            disabled={isInitializing}
                            className="flex-1 py-3 px-4 bg-cyber-purple hover:bg-purple-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isInitializing ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    <span>Initializing...</span>
                                </>
                            ) : (
                                <>
                                    <Camera size={16} />
                                    <span>Enable Camera</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={onReady}
                            disabled={!canStart}
                            className={`flex-1 py-3 px-4 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${canStart
                                ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                : 'bg-gray-600 cursor-not-allowed opacity-50'
                                }`}
                        >
                            <CheckCircle size={16} />
                            <span>{canStart ? "I'm Ready" : 'Position yourself'}</span>
                        </button>
                    )}
                </div>

                {/* Privacy Note */}
                <p className="text-[10px] text-gray-600 text-center mt-4">
                    🔒 Your video is processed locally and never stored or transmitted.
                </p>
            </div>
        </div>
    );
};
