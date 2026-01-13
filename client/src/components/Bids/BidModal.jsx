import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BidModal = ({ gig, isOpen, onClose }) => {
  const [formData, setFormData] = useState({ message: '', price: gig.budget });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setFormData({ message: '', price: gig.budget });
    }
  }, [isOpen, gig.budget]);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/bids`, {
        gigId: gig._id,
        ...formData
      });
      toast.success('Proposal sent successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;


  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >

      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />


      <div className="flex min-h-full items-center justify-center p-4">
        <div className="card w-full max-w-lg relative">

          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>


          <div className="p-8">
            <div className="pr-10 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Submit Proposal
              </h2>
              <p className="text-slate-600">
                Applying for: <span className="font-semibold text-indigo-600">{gig.title}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Approach
                </label>
                <textarea
                  required
                  rows="6"
                  className="input resize-none"
                  placeholder="Explain why you're the best fit for this project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quote Price (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="input"
                  placeholder="Enter your price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BidModal;
