import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

export interface ArenaMessage {
    type: 'JOIN_QUEUE' | 'LEAVE_QUEUE' | 'MATCH_FOUND' | 'BATTLE_START' | 'PROGRESS_UPDATE' | 'OPPONENT_PROGRESS' | 'SUBMIT_SOLUTION' | 'GAME_END' | 'ERROR';
    sessionId: string | null;
    playerId: string | null;
    payload: any;
}

export interface UseArenaWebSocketOptions {
    playerId: string;
    onMessage?: (message: ArenaMessage) => void;
}

export const useArenaWebSocket = ({ playerId, onMessage }: UseArenaWebSocketOptions) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const clientRef = useRef<Client | null>(null);
    const sessionIdRef = useRef<string | null>(null);

    // Connect to WebSocket
    const connect = useCallback(() => {
        if (clientRef.current?.connected) {
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS('/ws/arena'),
            debug: (str) => {
                console.log('[STOMP]', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('Connected to Arena WebSocket');
            setConnected(true);
            setError(null);

            // Subscribe to player-specific messages
            client.subscribe(`/topic/player/${playerId}`, (message: IMessage) => {
                try {
                    const parsed: ArenaMessage = JSON.parse(message.body);
                    console.log('Received player message:', parsed);

                    // Store session ID if match found
                    if (parsed.type === 'MATCH_FOUND' && parsed.sessionId) {
                        sessionIdRef.current = parsed.sessionId;
                        // Subscribe to session topic
                        client.subscribe(`/topic/arena/${parsed.sessionId}`, (sessionMsg: IMessage) => {
                            try {
                                const sessionParsed: ArenaMessage = JSON.parse(sessionMsg.body);
                                console.log('Received session message:', sessionParsed);
                                onMessage?.(sessionParsed);
                            } catch (e) {
                                console.error('Failed to parse session message:', e);
                            }
                        });
                    }

                    onMessage?.(parsed);
                } catch (e) {
                    console.error('Failed to parse message:', e);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            setError('Connection error');
            setConnected(false);
        };

        client.onDisconnect = () => {
            console.log('Disconnected from Arena WebSocket');
            setConnected(false);
        };

        client.activate();
        clientRef.current = client;
    }, [playerId, onMessage]);

    // Disconnect
    const disconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
            sessionIdRef.current = null;
            setConnected(false);
        }
    }, []);

    // Join matchmaking queue
    const joinQueue = useCallback((username: string, rating: number) => {
        if (!clientRef.current?.connected) {
            console.error('Not connected to WebSocket');
            return;
        }

        clientRef.current.publish({
            destination: '/app/arena/join',
            body: JSON.stringify({
                playerId,
                username,
                rating,
            }),
        });
    }, [playerId]);

    // Leave queue
    const leaveQueue = useCallback(() => {
        if (!clientRef.current?.connected) {
            return;
        }

        clientRef.current.publish({
            destination: '/app/arena/leave',
            body: JSON.stringify({ playerId }),
        });
    }, [playerId]);

    // Send progress update
    const sendProgress = useCallback((progress: number, testsPassed: number, totalTests: number) => {
        if (!clientRef.current?.connected || !sessionIdRef.current) {
            return;
        }

        clientRef.current.publish({
            destination: '/app/arena/progress',
            body: JSON.stringify({
                sessionId: sessionIdRef.current,
                playerId,
                progress,
                testsPassed,
                totalTests,
            }),
        });
    }, [playerId]);

    // Submit solution
    const submitSolution = useCallback((allPassed: boolean, testsPassed: number, totalTests: number) => {
        if (!clientRef.current?.connected || !sessionIdRef.current) {
            return;
        }

        clientRef.current.publish({
            destination: '/app/arena/submit',
            body: JSON.stringify({
                sessionId: sessionIdRef.current,
                playerId,
                allPassed,
                testsPassed,
                totalTests,
            }),
        });
    }, [playerId]);

    // Handle timeout
    const sendTimeout = useCallback(() => {
        if (!clientRef.current?.connected || !sessionIdRef.current) {
            return;
        }

        clientRef.current.publish({
            destination: '/app/arena/timeout',
            body: JSON.stringify({
                sessionId: sessionIdRef.current,
            }),
        });
    }, []);

    // Get current session ID
    const getSessionId = useCallback(() => sessionIdRef.current, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        connected,
        error,
        connect,
        disconnect,
        joinQueue,
        leaveQueue,
        sendProgress,
        submitSolution,
        sendTimeout,
        getSessionId,
    };
};
