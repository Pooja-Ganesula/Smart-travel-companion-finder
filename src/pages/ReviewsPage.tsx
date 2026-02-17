import { useState } from 'react';
import ReviewSystem from '../components/ReviewSystem';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockUsers';
import type { User } from '../types';

export default function ReviewsPage() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(mockUsers[0]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
        <p className="text-gray-600">
          View and write reviews for travel companions. Build trust through transparent feedback.
        </p>
      </div>

      {/* User Selection for Demo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select User to Review</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockUsers.slice(0, 8).map((mockUser) => (
            <button
              key={mockUser.userId}
              onClick={() => setSelectedUser(mockUser)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedUser?.userId === mockUser.userId
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={mockUser.photoUrl}
                alt={mockUser.name}
                className="w-12 h-12 rounded-full mx-auto mb-2 object-cover"
              />
              <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
              <p className="text-xs text-gray-500">{mockUser.stats.averageRating.toFixed(1)} ★</p>
            </button>
          ))}
        </div>
      </div>

      {/* Review System */}
      {selectedUser && user && (
        <ReviewSystem
          currentUser={user}
          targetUser={selectedUser}
          matchId={`demo-match-${user.userId}-${selectedUser.userId}`}
        />
      )}
    </div>
  );
}
