import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MapPin, Shield, Star, Wallet } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function MatchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    getMatchById,
    updateMatchStatus,
    getMessagesForMatch,
    sendMessage,
    addReview,
    getReviewByMatch,
  } = useApp();

  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const match = id ? getMatchById(id) : undefined;

  const review = useMemo(() => (id ? getReviewByMatch(id) : undefined), [id, getReviewByMatch]);
  const messages = id ? getMessagesForMatch(id) : [];

  if (!match || !user || !id) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-800">Match not found</h2>
        <button onClick={() => navigate('/find-companion')} className="text-teal-600 mt-4">
          Back to companion search
        </button>
      </div>
    );
  }

  const isMatched = match.matchStatus === 'Matched';

  const handleConnect = () => {
    updateMatchStatus(match.matchId, 'Matched');
  };

  const handleReject = () => {
    updateMatchStatus(match.matchId, 'Rejected');
    navigate('/find-companion');
  };

  const handleSendMessage = (text: string) => {
    sendMessage(match.matchId, user.userId, text);

    window.setTimeout(() => {
      sendMessage(match.matchId, match.user.userId, 'Great! Let us finalize itinerary and stay options.');
    }, 900);
  };

  const submitReview = () => {
    if (!reviewComment.trim()) return;
    addReview(match.matchId, user.userId, rating, reviewComment.trim());
    setReviewComment('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-600 to-cyan-600" />

        <div className="p-6 -mt-12">
          <div className="flex flex-wrap items-end gap-4">
            <img
              src={match.user.photoUrl}
              alt={match.user.name}
              className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {match.user.name}
                {match.user.verificationStatus === 'Verified' && <Shield className="h-5 w-5 text-teal-500 ml-2" />}
              </h1>
              <p className="text-gray-600 text-sm">
                {match.user.age} • {match.user.gender} • {match.user.profile.travelStyle}
              </p>
              <p className="text-xs text-gray-500 inline-flex items-center mt-1">
                <MapPin size={12} className="mr-1" /> {match.user.currentCity}, {match.user.homeCountry}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">Compatibility</p>
              <p className="text-3xl font-bold text-teal-700">{match.score}%</p>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4 bg-green-50 border border-green-100">
              <p className="text-xs text-green-700">Common Interests</p>
              <p className="font-semibold text-green-900">{match.matchDetails.interestMatch.join(', ') || 'N/A'}</p>
            </div>
            <div className="rounded-xl p-4 bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700 inline-flex items-center"><Wallet size={12} className="mr-1" /> Budget Compatibility</p>
              <p className="font-semibold text-blue-900">{match.matchDetails.budgetCompatibility}</p>
            </div>
            <div className="rounded-xl p-4 bg-purple-50 border border-purple-100">
              <p className="text-xs text-purple-700">Trip Filter Status</p>
              <p className="font-semibold text-purple-900">
                Destination: {match.matchDetails.destinationMatch ? 'Yes' : 'No'} • Date overlap: {match.matchDetails.dateOverlap ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {isMatched ? (
              <div className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-100 text-emerald-700 text-sm font-medium">
                <CheckCircle size={16} className="mr-2" /> Match Confirmed
              </div>
            ) : (
              <>
                <button
                  onClick={handleConnect}
                  className="px-4 py-2 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
                >
                  Confirm Match & Enable Chat
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Chat Box</h2>
        <ChatInterface match={match} currentUser={user} messages={messages} onSendMessage={handleSendMessage} />
      </div>

      {isMatched && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Rate & Review</h3>

          {review ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-800 inline-flex items-center">
                <Star size={14} className="mr-1 text-amber-500" /> {review.rating}/5
              </p>
              <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`p-1 ${value <= rating ? 'text-amber-500' : 'text-gray-300'}`}
                  >
                    <Star className="h-5 w-5" fill="currentColor" />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your coordination experience"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button
                onClick={submitReview}
                className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-black"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
