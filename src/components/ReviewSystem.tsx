import { useState, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  User as UserIcon,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { Review, User } from '../types';
import { useReview } from '../utils/reviewManager';

interface ReviewSystemProps {
  currentUser: User;
  targetUser?: User;
  matchId?: string;
  groupId?: string;
  tripId?: string;
}

export default function ReviewSystem({ 
  currentUser, 
  targetUser, 
  matchId, 
  groupId, 
  tripId 
}: ReviewSystemProps) {
  const {
    createReview,
    updateReview,
    deleteReview,
    voteHelpful,
    getUserReviews,
    getUserAverageRating,
    canReview,
    getReviewSummary,
  } = useReview();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    categories: {
      communication: 5,
      reliability: 5,
      compatibility: 5,
      overall: 5,
    },
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'stats' | 'summary'>('reviews');

  useEffect(() => {
    if (targetUser) {
      const userReviews = getUserReviews(targetUser.userId, { asReviewee: true, publicOnly: true });
      setReviews(userReviews);
    }
  }, [targetUser, getUserReviews]);

  const handleSubmitReview = async () => {
    if (!targetUser || !canReview(currentUser.userId, targetUser.userId, matchId, groupId)) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingReview) {
        await updateReview(editingReview.reviewId, currentUser.userId, reviewData);
        setEditingReview(null);
      } else {
        await createReview(
          currentUser.userId,
          targetUser.userId,
          reviewData.rating,
          reviewData.comment,
          reviewData.categories,
          matchId,
          groupId,
          tripId,
          reviewData.isPublic
        );
      }
      
      // Reload reviews
      const updatedReviews = getUserReviews(targetUser.userId, { asReviewee: true, publicOnly: true });
      setReviews(updatedReviews);
      
      // Reset form
      setReviewData({
        rating: 5,
        comment: '',
        categories: {
          communication: 5,
          reliability: 5,
          compatibility: 5,
          overall: 5,
        },
        isPublic: true,
      });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewData({
      rating: review.rating,
      comment: review.comment,
      categories: review.categories,
      isPublic: review.isPublic,
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId, currentUser.userId);
        const updatedReviews = getUserReviews(targetUser!.userId, { asReviewee: true, publicOnly: true });
        setReviews(updatedReviews);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    try {
      await voteHelpful(reviewId, currentUser.userId);
      const updatedReviews = getUserReviews(targetUser!.userId, { asReviewee: true, publicOnly: true });
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Failed to vote helpful:', error);
    }
  };

  const averageRating = targetUser ? getUserAverageRating(targetUser.userId) : null;
  const reviewSummary = targetUser ? getReviewSummary(targetUser.userId) : null;
  const canUserReview = targetUser && canReview(currentUser.userId, targetUser.userId, matchId, groupId);

  const renderStars = (rating: number, interactive = false, size = 'normal') => {
    const starSize = size === 'small' ? 'h-4 w-4' : 'h-5 w-5';
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            } ${
              interactive ? 'cursor-pointer hover:text-yellow-300' : ''
            }`}
            onClick={() => {
              if (interactive) {
                setReviewData({ ...reviewData, rating: star });
              }
            }}
          />
        ))}
      </div>
    );
  };

  const renderCategoryRating = (category: keyof typeof reviewData.categories, label: string) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        {renderStars(reviewData.categories[category], true, 'small')}
        <span className="text-sm text-gray-600">{reviewData.categories[category]}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* User Rating Overview */}
      {targetUser && averageRating && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={targetUser.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
                alt={targetUser.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{targetUser.name}</h3>
                <div className="flex items-center space-x-2">
                  {renderStars(Math.round(averageRating.overall))}
                  <span className="text-lg font-semibold text-gray-900">
                    {averageRating.overall.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({averageRating.totalReviews} reviews)
                  </span>
                </div>
                {targetUser.verificationStatus === 'Verified' && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified Traveler
                  </div>
                )}
              </div>
            </div>
            
            {canUserReview && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
              >
                {editingReview ? 'Edit Review' : 'Write Review'}
              </button>
            )}
          </div>

          {/* Rating Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{averageRating.communication.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Communication</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{averageRating.reliability.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{averageRating.compatibility.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Compatibility</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{targetUser.stats.tripsCompleted}</div>
              <div className="text-sm text-gray-500">Trips Completed</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      {targetUser && (
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['reviews', 'stats', 'summary'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'stats' ? 'Statistics' : tab}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && targetUser && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingReview ? 'Edit Your Review' : `Write a Review for ${targetUser.name}`}
          </h3>
          
          <div className="space-y-4">
            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center space-x-2">
                {renderStars(reviewData.rating, true)}
                <span className="text-sm text-gray-600">{reviewData.rating} out of 5</span>
              </div>
            </div>

            {/* Category Ratings */}
            <div className="space-y-3">
              {renderCategoryRating('communication', 'Communication')}
              {renderCategoryRating('reliability', 'Reliability')}
              {renderCategoryRating('compatibility', 'Compatibility')}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Share your experience traveling with this person..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                rows={4}
                minLength={10}
              />
            </div>

            {/* Public/Private */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={reviewData.isPublic}
                onChange={(e) => setReviewData({ ...reviewData, isPublic: e.target.checked })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                Make this review public
              </label>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setReviewData({
                    rating: 5,
                    comment: '',
                    categories: {
                      communication: 5,
                      reliability: 5,
                      compatibility: 5,
                      overall: 5,
                    },
                    isPublic: true,
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting || reviewData.comment.length < 10}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.reviewId} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">User {review.reviewerId.slice(-4)}</span>
                        {renderStars(review.rating, false, 'small')}
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Category Breakdown */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                        <span>Comm: {review.categories.communication}</span>
                        <span>Rel: {review.categories.reliability}</span>
                        <span>Comp: {review.categories.compatibility}</span>
                      </div>
                      
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-4 mt-3">
                        <button
                          onClick={() => handleVoteHelpful(review.reviewId)}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>Helpful ({review.helpfulVotes})</span>
                        </button>
                        
                        {review.reviewerId === currentUser.userId && (
                          <>
                            <button
                              onClick={() => handleEditReview(review)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.reviewId)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">No reviews yet</p>
              <p className="text-gray-500 text-sm mt-1">
                {canUserReview ? 'Be the first to write a review!' : 'Reviews will appear here once travelers share their experiences.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && targetUser && averageRating && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Review Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const percentage = (averageRating.totalReviews > 0) 
                    ? (Math.random() * 100) // Placeholder - would calculate from actual data
                    : 0;
                  
                  return (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-10">{Math.round(percentage)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* User Stats */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Travel Statistics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trips Completed</span>
                  <span className="font-semibold text-gray-900">{targetUser.stats.tripsCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviews Received</span>
                  <span className="font-semibold text-gray-900">{targetUser.stats.reviewsReceived}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-semibold text-gray-900">{targetUser.stats.responseRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verification Status</span>
                  <span className={`font-semibold ${
                    targetUser.verificationStatus === 'Verified' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {targetUser.verificationStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && reviewSummary && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Review Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h4 className="font-medium text-green-700 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Strengths
              </h4>
              {reviewSummary.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {reviewSummary.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Not enough reviews yet</p>
              )}
            </div>
            
            {/* Areas for Improvement */}
            <div>
              <h4 className="font-medium text-orange-700 mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Areas for Improvement
              </h4>
              {reviewSummary.improvements.length > 0 ? (
                <ul className="space-y-2">
                  {reviewSummary.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No specific areas identified</p>
              )}
            </div>
          </div>
          
          {/* Common Feedback */}
          {reviewSummary.commonFeedback.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-blue-700 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Common Feedback Themes
              </h4>
              <div className="flex flex-wrap gap-2">
                {reviewSummary.commonFeedback.map((feedback: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {feedback}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
