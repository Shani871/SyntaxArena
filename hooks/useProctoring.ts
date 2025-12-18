import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

export interface ProctoringState {
    isEnabled: boolean;
    hasPermission: boolean;
    faceCount: number;
    violations: number;
    status: 'idle' | 'initializing' | 'active' | 'violation' | 'disqualified';
    lastViolationTime: number | null;
    errorMessage: string | null;
}

export interface UseProctoringOptions {
    onViolation?: (violationCount: number, reason: 'NO_FACE' | 'MULTIPLE_FACES') => void;
    onDisqualified?: () => void;
    maxViolations?: number;
    checkIntervalMs?: number;
    gracePeriodMs?: number;
}

export const useProctoring = (options: UseProctoringOptions = {}) => {
    const {
        onViolation,
        onDisqualified,
        maxViolations = 4,
        checkIntervalMs = 2000,
        gracePeriodMs = 3000,
    } = options;

    const [state, setState] = useState<ProctoringState>({
        isEnabled: false,
        hasPermission: false,
        faceCount: 0,
        violations: 0,
        status: 'idle',
        lastViolationTime: null,
        errorMessage: null,
    });

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const consecutiveViolationsRef = useRef(0);

    // Request camera permission
    const requestCameraPermission = useCallback(async (): Promise<boolean> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 320, height: 240 }
            });
            streamRef.current = stream;
            setState(prev => ({ ...prev, hasPermission: true, errorMessage: null }));
            return true;
        } catch (error) {
            console.error('Camera permission denied:', error);
            setState(prev => ({
                ...prev,
                hasPermission: false,
                errorMessage: 'Camera permission denied. Please allow camera access to participate.',
            }));
            return false;
        }
    }, []);

    // Initialize TensorFlow and BlazeFace model
    const initializeModel = useCallback(async (): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, status: 'initializing' }));

            // Set TensorFlow backend
            await tf.setBackend('webgl');
            await tf.ready();

            // Load BlazeFace model
            const model = await blazeface.load();
            modelRef.current = model;

            console.log('BlazeFace model loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load face detection model:', error);
            setState(prev => ({
                ...prev,
                status: 'idle',
                errorMessage: 'Failed to load face detection model.',
            }));
            return false;
        }
    }, []);

    // Attach stream to video element
    const attachVideoStream = useCallback((videoElement: HTMLVideoElement) => {
        videoRef.current = videoElement;
        if (streamRef.current && videoElement) {
            videoElement.srcObject = streamRef.current;
        }
    }, []);

    // Detect faces in current frame
    const detectFaces = useCallback(async (): Promise<number> => {
        if (!modelRef.current || !videoRef.current) return -1;

        const video = videoRef.current;
        if (video.readyState !== 4) return -1; // Video not ready

        try {
            const predictions = await modelRef.current.estimateFaces(video, false);
            return predictions.length;
        } catch (error) {
            console.error('Face detection error:', error);
            return -1;
        }
    }, []);

    // Handle violation
    const handleViolation = useCallback((reason: 'NO_FACE' | 'MULTIPLE_FACES') => {
        consecutiveViolationsRef.current += 1;

        // Check grace period
        if (consecutiveViolationsRef.current < 2) {
            return; // Don't count single-frame violations
        }

        setState(prev => {
            const newViolations = prev.violations + 1;

            if (newViolations >= maxViolations) {
                onDisqualified?.();
                return {
                    ...prev,
                    violations: newViolations,
                    status: 'disqualified',
                    lastViolationTime: Date.now(),
                };
            }

            onViolation?.(newViolations, reason);
            return {
                ...prev,
                violations: newViolations,
                status: 'violation',
                lastViolationTime: Date.now(),
            };
        });
    }, [maxViolations, onViolation, onDisqualified]);

    // Clear violation state
    const clearViolation = useCallback(() => {
        consecutiveViolationsRef.current = 0;
        setState(prev => {
            if (prev.status === 'violation') {
                return { ...prev, status: 'active' };
            }
            return prev;
        });
    }, []);

    // Start proctoring
    const startProctoring = useCallback(async (): Promise<boolean> => {
        // Check if we have permission
        if (!streamRef.current) {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) return false;
        }

        // Initialize model if needed
        if (!modelRef.current) {
            const modelLoaded = await initializeModel();
            if (!modelLoaded) return false;
        }

        setState(prev => ({ ...prev, isEnabled: true, status: 'active' }));

        // Start periodic face detection
        intervalRef.current = setInterval(async () => {
            const faceCount = await detectFaces();

            if (faceCount === -1) return; // Skip if detection failed

            setState(prev => ({ ...prev, faceCount }));

            if (faceCount === 0) {
                handleViolation('NO_FACE');
            } else if (faceCount > 1) {
                handleViolation('MULTIPLE_FACES');
            } else {
                clearViolation();
            }
        }, checkIntervalMs);

        return true;
    }, [requestCameraPermission, initializeModel, detectFaces, handleViolation, clearViolation, checkIntervalMs]);

    // Stop proctoring
    const stopProctoring = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        setState({
            isEnabled: false,
            hasPermission: false,
            faceCount: 0,
            violations: 0,
            status: 'idle',
            lastViolationTime: null,
            errorMessage: null,
        });

        consecutiveViolationsRef.current = 0;
    }, []);

    // Reset violations (for giving another chance)
    const resetViolations = useCallback(() => {
        setState(prev => ({
            ...prev,
            violations: 0,
            status: prev.isEnabled ? 'active' : 'idle',
        }));
        consecutiveViolationsRef.current = 0;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopProctoring();
        };
    }, [stopProctoring]);

    return {
        ...state,
        requestCameraPermission,
        startProctoring,
        stopProctoring,
        attachVideoStream,
        resetViolations,
        maxViolations,
    };
};
