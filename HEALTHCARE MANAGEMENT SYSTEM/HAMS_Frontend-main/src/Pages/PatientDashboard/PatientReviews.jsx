import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAllAppointments } from './fetchAllAppointments';
import { useAuth } from '../../contexts/AuthContext';

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const PatientReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [addMsg, setAddMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  // Fetch doctor options from appointments
  useEffect(() => {
    fetchAllAppointments().then(appointments => {
      const doctorMap = {};
      appointments.forEach(appt => {
        if (appt.doctorId) {
          doctorMap[appt.doctorId] = appt.doctorName || appt.doctorId;
        }
      });
      setDoctorOptions(Object.entries(doctorMap).map(([id, name]) => ({ id, name })));
    });
  }, []);

  // Fetch reviews by patient
  useEffect(() => {
    if (user?.patientId || user?.id) {
      setLoading(true);
      axios.get(`${base_url}/reviews/patient/${user.patientId || user.id}`)
        .then(res => setReviews(res.data))
        .finally(() => setLoading(false));
    }
  }, [user, deleteMsg, addMsg]);

  // Helper to render stars (read-only)
  const renderStars = (rating) => (
    <span>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  );

  // Helper to render clickable stars for input
  const renderStarInput = (value, setValue) => (
    <div className="flex items-center space-x-1">
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => setValue(star)}
        >★</span>
      ))}
      <span className="ml-2 text-gray-500">{value ? `${value}/5` : ''}</span>
    </div>
  );

  // Add Review
  const handleAddReview = async (e) => {
    e.preventDefault();
    setAddMsg('');
    const patientId = user?.patientId || user?.id;
    try {
      await axios.post(`${base_url}/reviews`, {
        doctorId: selectedDoctor,
        patientId,
        rating,
        comment
      });
      setAddMsg('Review added!');
      setSelectedDoctor('');
      setRating(0);
      setComment('');
    } catch {
      setAddMsg('Failed to add review');
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId) => {
    setDeleteMsg("");
    try {
      await axios.delete(`${base_url}/reviews/${reviewId}`);
      setDeleteMsg("Review deleted successfully!");
    } catch (err) {
      setDeleteMsg("Failed to delete review");
    }
  };

  // Edit Review
  const handleEditClick = (review) => {
    setEditReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSubmit = async (reviewId) => {
    try {
      await axios.put(`${base_url}/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment
      });
      setEditReviewId(null);
      setEditRating(0);
      setEditComment('');
      setAddMsg('Review updated!');
    } catch {
      setAddMsg('Failed to update review');
    }
  };

  return (
    <div className="p-6 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-left">My Reviews</h2>
      {/* Add Review Form */}
      <form
        onSubmit={handleAddReview}
        className="mb-8 bg-white rounded-lg shadow-lg p-6 w-full space-y-4 text-left"
      >
        <div className="text-xl font-semibold text-cyan-700 mb-2">Add a Review</div>
        <div>
          <label className="block mb-1 text-gray-700">Doctor</label>
          <select
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}
            required
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          >
            <option value="" disabled>Select Doctor</option>
            {doctorOptions.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name} ({doc.id})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Rating</label>
          {renderStarInput(rating, setRating)}
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Comment</label>
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comment"
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-2 rounded font-semibold hover:bg-cyan-700 transition"
        >
          Submit Review
        </button>
        {addMsg && <div className={`mt-2 ${addMsg.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{addMsg}</div>}
      </form>
      {/* Reviews List */}
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 text-cyan-700 text-left">Your Submitted Reviews</h3>
        {loading ? (
          <div>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-500">You have not given any reviews yet.</div>
        ) : (
          console.log(reviews),
          <ul className="space-y-4">
            {reviews.map(review => (
              <li key={review._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white shadow w-full">
                <div className="flex-1 text-left">
                  <div className="font-semibold text-lg">
                    {review.doctorName || review.doctorId || 'Unknown Doctor'}
                  </div>
                  <div className="flex items-center mb-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-gray-500">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {editReviewId === review._id ? (
                    <form onSubmit={e => { e.preventDefault(); handleEditSubmit(review._id); }} className="flex flex-col md:flex-row gap-2 mt-2 items-center">
                      {renderStarInput(editRating, setEditRating)}
                      <input
                        type="text"
                        value={editComment}
                        onChange={e => setEditComment(e.target.value)}
                        className="border p-2 rounded w-48"
                        required
                      />
                      <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Save</button>
                      <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => setEditReviewId(null)}>Cancel</button>
                    </form>
                  ) : (
                    <div className="text-gray-700 mt-1">{review.comment}</div>
                  )}
                </div>
                <div className="flex flex-row gap-2 mt-2 md:mt-0">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                    title="Edit Review"
                    onClick={() => handleEditClick(review)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold"
                    title="Delete Review"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {deleteMsg && <div className={`mt-2 ${deleteMsg.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{deleteMsg}</div>}
      </div>
    </div>
  );
};

export default PatientReviews;
