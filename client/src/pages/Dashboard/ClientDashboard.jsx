import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, MessageSquare, CheckCircle, Loader2, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
    const [bids, setBids] = useState([]);
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hiringId, setHiringId] = useState(null);
    const { gigId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gigRes, bidsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/gigs/${gigId}`),
                    axios.get(`http://localhost:5000/api/bids/${gigId}`)
                ]);
                setGig(gigRes.data.data.gig);
                setBids(bidsRes.data.data.bids);
            } catch (error) {
                toast.error('Failed to load dashboard data');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [gigId, navigate]);

    const handleHire = async (bidId) => {
        if (!window.confirm('Confirm hiring this professional? This will automatically reject other applications.')) return;

        setHiringId(bidId);
        try {
            await axios.patch(`http://localhost:5000/api/bids/${bidId}/hire`);
            toast.success('Hiring complete! The freelancer has been notified.');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Hiring failed');
        } finally {
            setHiringId(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-slate-500 font-semibold">Loading dashboard...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-8 transition-colors font-semibold"
            >
                <ArrowLeft className="h-5 w-5" />
                Back to Feed
            </button>

            <div className="card p-8 mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                            <span className={`badge ${gig?.status === 'open' ? 'badge-success' : 'badge-primary'}`}>
                                {gig?.status}
                            </span>
                            <span className="text-slate-500 text-sm flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(gig?.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {gig?.title}
                        </h1>
                        <p className="text-slate-600">{gig?.description}</p>
                    </div>

                    <div className="bg-indigo-600 text-white rounded-2xl p-6 min-w-[240px]">
                        <p className="text-indigo-200 text-sm font-semibold mb-2">Total Budget</p>
                        <p className="text-3xl font-bold">
                            ₹{gig?.budget.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    Proposals Received
                    <span className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full font-semibold">
                        {bids.length}
                    </span>
                </h2>

                <div className="space-y-4">
                    {bids.map((bid) => (
                        <div
                            key={bid._id}
                            className={`card p-6 ${bid.status === 'hired' ? 'ring-2 ring-indigo-600' : ''}`}
                        >
                            {bid.status === 'hired' && (
                                <div className="mb-4">
                                    <span className="badge badge-success flex items-center gap-2 w-fit">
                                        <CheckCircle className="h-4 w-4" />
                                        Selected Candidate
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="shrink-0">
                                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-700">
                                        {bid.freelancerId?.name?.[0]}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{bid.freelancerId?.name}</h3>
                                            <p className="text-slate-500 text-sm">{bid.freelancerId?.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 font-semibold mb-1">Bid Amount</p>
                                            <p className="text-2xl font-bold text-indigo-600">
                                                ₹{bid.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-slate-600 italic">"{bid.message}"</p>
                                    </div>

                                    <div className="flex justify-end">
                                        {gig.status === 'open' ? (
                                            <button
                                                onClick={() => handleHire(bid._id)}
                                                disabled={hiringId === bid._id}
                                                className="btn-primary flex items-center gap-2"
                                            >
                                                {hiringId === bid._id ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-5 w-5" />
                                                        <span>Hire</span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <span className={`badge ${bid.status === 'hired' ? 'badge-success' : 'bg-slate-100 text-slate-500'}`}>
                                                {bid.status === 'hired' ? 'Selected' : 'Rejected'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {bids.length === 0 && (
                        <div className="card p-12 text-center">
                            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Proposals Yet</h3>
                            <p className="text-slate-500">Freelancers will start submitting proposals soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
