import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../../store/slices/gigSlice';
import GigCard from '../../components/Gigs/GigCard';
import { Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const GigFeed = () => {
    const dispatch = useDispatch();
    const { gigs, loading } = useSelector((state) => state.gigs);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchGigs(searchTerm));
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Browse Projects</h1>
                    <p className="text-slate-600 mt-1">Find your next opportunity</p>
                </div>
                <Link to="/create-gig" className="btn-primary flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Post Project
                </Link>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="input w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}

                    {gigs.length === 0 && (
                        <div className="col-span-full text-center py-20">
                            <p className="text-slate-500">No projects found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GigFeed;
