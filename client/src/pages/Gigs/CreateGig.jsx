import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../../store/slices/gigSlice';
import toast from 'react-hot-toast';
import { Plus, Loader2 } from 'lucide-react';

const CreateGig = () => {
    const [formData, setFormData] = useState({ title: '', description: '', budget: '' });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await dispatch(createGig(formData));
        setLoading(false);

        if (createGig.fulfilled.match(result)) {
            toast.success('Project created successfully!');
            navigate('/');
        } else {
            toast.error(result.payload || 'Failed to create project');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="card p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Post a New Project</h1>
                <p className="text-slate-600 mb-8">Fill in the details below to get started</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Project Title
                        </label>
                        <input
                            type="text"
                            required
                            className="input"
                            placeholder="e.g. Build a responsive website"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Project Description
                        </label>
                        <textarea
                            required
                            rows="6"
                            className="input resize-none"
                            placeholder="Describe your project requirements, timeline, and expectations..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Budget (₹)
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="input"
                            placeholder="5000"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Funds will be held in escrow once a freelancer is hired
                        </p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    <span>Post Project</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGig;
