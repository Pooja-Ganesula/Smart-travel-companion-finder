/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ChatMessage, Match, MatchSummary, PlaceRequest, Review, Trip, Group } from '../types';
import { useAuth } from './AuthContext';
import { mockUsers } from '../data/mockUsers';
import { mockTrips } from '../data/mockTrips';
import { runAdvancedMatchingPipeline, validateTripInput } from '../utils/advancedMatchingAlgorithm';

interface AppContextType {
    currentTrip: Trip | null;
    createTrip: (trip: Trip) => boolean;
    matches: Match[];
    groups: Group[];
    generateMatches: (tripOverride?: Trip) => void;
    isMatching: boolean;
    matchSummary: MatchSummary | null;
    validationErrors: string[];
    updateMatchStatus: (matchId: string, status: Match['matchStatus']) => void;
    getMatchById: (matchId: string) => Match | undefined;
    getMessagesForMatch: (matchId: string) => ChatMessage[];
    sendMessage: (matchId: string, senderId: string, text: string) => void;
    addReview: (matchId: string, reviewerId: string, rating: number, comment: string) => void;
    getReviewByMatch: (matchId: string) => Review | undefined;
    placeRequests: PlaceRequest[];
    addPlaceRequest: (request: Omit<PlaceRequest, 'requestId' | 'createdAt'>) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [isMatching, setIsMatching] = useState(false);
    const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [messagesByMatch, setMessagesByMatch] = useState<Record<string, ChatMessage[]>>({});
    const [reviews, setReviews] = useState<Review[]>([]);
    const [placeRequests, setPlaceRequests] = useState<PlaceRequest[]>([
        {
            requestId: 'pr-1',
            userId: 'u5',
            userName: 'Priya Patel',
            destination: 'Kerala',
            placeImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=900',
            pinLat: 10.1632,
            pinLng: 76.6413,
            pinLabel: 'Kerala',
            startDate: '2026-03-10',
            endDate: '2026-03-15',
            companionsNeeded: 2,
            budget: 'Medium',
            travelType: 'Leisure',
            notes: 'Looking for easy-going travelers for nature and café hopping.',
            createdAt: new Date().toISOString(),
            status: 'Open',
            applicants: [],
        },
        {
            requestId: 'pr-2',
            userId: 'u2',
            userName: 'Mike Ross',
            destination: 'Ladakh',
            placeImage: 'https://images.unsplash.com/photo-1482164565953-04b62dc3dfdf?auto=format&fit=crop&q=80&w=900',
            pinLat: 34.1526,
            pinLng: 77.5771,
            pinLabel: 'Ladakh',
            startDate: '2026-04-02',
            endDate: '2026-04-08',
            companionsNeeded: 3,
            budget: 'Medium',
            travelType: 'Adventure',
            notes: 'Road trip + trekking. Need active buddies comfortable with altitude.',
            createdAt: new Date().toISOString(),
            status: 'Open',
            applicants: [],
        },
    ]);

    const createTrip = (trip: Trip): boolean => {
        const errors = validateTripInput(trip);
        setValidationErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        setCurrentTrip(trip);
        return true;
    };

    const generateMatches = (tripOverride?: Trip) => {
        const tripToMatch = tripOverride ?? currentTrip;

        if (user && tripToMatch) {
            setIsMatching(true);
            const result = runAdvancedMatchingPipeline(user, tripToMatch, mockUsers, mockTrips);

            setMatches((prev) => {
                const previousStatusMap = new Map(prev.map((m) => [m.matchId, m.matchStatus]));

                return result.matches.map((match) => ({
                    ...match,
                    matchStatus:
                        previousStatusMap.get(match.matchId) === 'Matched'
                            ? 'Matched'
                            : previousStatusMap.get(match.matchId) === 'Rejected'
                                ? 'Rejected'
                                : match.matchStatus,
                }));
            });
            setGroups(result.groups);
            setMatchSummary(result.summary);
            setTimeout(() => setIsMatching(false), 500);
        }
    };

    const updateMatchStatus = (matchId: string, status: Match['matchStatus']) => {
        let matchedUserId = '';
        setMatches((prev) =>
            prev.map((item) => {
                if (item.matchId !== matchId) return item;
                matchedUserId = item.user.userId;
                return { ...item, matchStatus: status };
            }),
        );

        if (status === 'Matched') {
            setMessagesByMatch((prev) => {
                if (prev[matchId]?.length) return prev;
                if (!matchedUserId) return prev;

                return {
                    ...prev,
                    [matchId]: [
                        {
                            messageId: `${matchId}-msg-1`,
                            chatId: matchId,
                            senderId: matchedUserId,
                            text: `Hi! Glad we matched. Want to align a plan for ${currentTrip?.destination ?? 'the trip'}?`,
                            timestamp: new Date().toISOString(),
                            messageType: 'text',
                            isEdited: false,
                            readBy: [matchedUserId],
                            reactions: [],
                        },
                    ],
                };
            });
        }
    };

    const getMatchById = (matchId: string) => matches.find((m) => m.matchId === matchId);

    const getMessagesForMatch = (matchId: string) => messagesByMatch[matchId] ?? [];

    const sendMessage = (matchId: string, senderId: string, text: string) => {
        const message: ChatMessage = {
            messageId: `${matchId}-${Date.now()}`,
            chatId: matchId,
            senderId,
            text,
            timestamp: new Date().toISOString(),
            messageType: 'text',
            isEdited: false,
            readBy: [senderId],
            reactions: [],
        };

        setMessagesByMatch((prev) => ({
            ...prev,
            [matchId]: [...(prev[matchId] ?? []), message],
        }));
    };

    const addReview = (matchId: string, reviewerId: string, rating: number, comment: string) => {
        const existing = reviews.find((review) => review.matchId === matchId && review.reviewerId === reviewerId);
        const match = matches.find((item) => item.matchId === matchId);
        const revieweeId = match?.user.userId ?? reviewerId;

        if (existing) {
            setReviews((prev) =>
                prev.map((review) =>
                    review.reviewId === existing.reviewId
                        ? { ...review, rating, comment, createdAt: new Date().toISOString() }
                        : review,
                ),
            );
            return;
        }

        setReviews((prev) => [
            ...prev,
            {
                reviewId: `r-${matchId}-${reviewerId}`,
                matchId,
                reviewerId,
                revieweeId,
                categories: {
                    communication: rating,
                    reliability: rating,
                    compatibility: rating,
                    overall: rating,
                },
                isPublic: true,
                rating,
                comment,
                createdAt: new Date().toISOString(),
                helpfulVotes: 0,
            },
        ]);
    };

    const getReviewByMatch = (matchId: string) => reviews.find((review) => review.matchId === matchId);

    const addPlaceRequest = (request: Omit<PlaceRequest, 'requestId' | 'createdAt'>): boolean => {
        if (!request.destination.trim() || !request.notes.trim() || request.companionsNeeded < 1) {
            return false;
        }

        setPlaceRequests((prev) => [
            {
                ...request,
                requestId: `pr-${Date.now()}`,
                createdAt: new Date().toISOString(),
            },
            ...prev,
        ]);

        return true;
    };

    const value = {
        currentTrip,
        createTrip,
        matches,
        groups,
        generateMatches,
        isMatching,
        matchSummary,
        validationErrors,
        updateMatchStatus,
        getMatchById,
        getMessagesForMatch,
        sendMessage,
        addReview,
        getReviewByMatch,
        placeRequests,
        addPlaceRequest,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
