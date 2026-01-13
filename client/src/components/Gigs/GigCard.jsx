import React, { useState } from 'react';
import { IndianRupee, Clock, User, Briefcase, LayoutDashboard } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BidModal from '../Bids/BidModal';

const GigCard = ({ gig }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const isOwner = user?._id === gig.ownerId?._id;

    return (
        <div className="card p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-900 line-clamp-2 flex-1">
                    {gig.title}
                </h3>
                <div className="badge badge-primary ml-4 shrink-0">
                    <IndianRupee className="h-3 w-3" />
                    {gig.budget.toLocaleString()}
                </div>
            </div>

            <p className="text-slate-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                {gig.description}
            </p>

            <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{gig.ownerId?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <button
                onClick={() => isOwner ? navigate(`/dashboard/${gig._id}`) : setIsModalOpen(true)}
                className={isOwner ? "btn-secondary w-full flex items-center justify-center gap-2" : "btn-primary w-full flex items-center justify-center gap-2"}
            >
                {isOwner ? <LayoutDashboard className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                {isOwner ? 'View Dashboard' : 'Place Bid'}
            </button>

            <BidModal
                gig={gig}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default GigCard;
