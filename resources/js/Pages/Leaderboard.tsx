import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { getBeltBadgeStyle, getBeltStyle } from '@/beltHelpers';

interface LeaderboardAthlete {
    id: number;
    name: string;
    points: number;
    belt_rank: string;
}

export default function Leaderboard({ leaderboard = [] }: { leaderboard: LeaderboardAthlete[] }) {
    const [search, setSearch] = useState('');

    const filteredLeaderboard = leaderboard.filter(ath =>
        ath.name.toLowerCase().includes(search.toLowerCase())
    );

    // Identify podium users
    const topThree = filteredLeaderboard.slice(0, 3);
    const rest = filteredLeaderboard.slice(3);

    // Arrange top 3 as: 2nd, 1st, 3rd for podium layout
    const podiumOrder = [];
    if (topThree[1]) podiumOrder.push({ ...topThree[1], rank: 2 });
    if (topThree[0]) podiumOrder.push({ ...topThree[0], rank: 1 });
    if (topThree[2]) podiumOrder.push({ ...topThree[2], rank: 3 });

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Top athletes ranked by training and event points</p>
                </div>
            }
        >
            <Head title="Club Leaderboard" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Search bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">🔍</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search athletes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
                        />
                    </div>

                    {/* Podium (Top 3) */}
                    {podiumOrder.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-end justify-center gap-6 pt-4 pb-8 border-b border-gray-100">
                            {podiumOrder.map((ath) => {
                                const isFirst = ath.rank === 1;
                                const isSecond = ath.rank === 2;
                                const isThird = ath.rank === 3;
                                
                                return (
                                    <div 
                                        key={ath.id} 
                                        className={`flex flex-col items-center w-full sm:w-48 bg-white border border-gray-100/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                                            isFirst ? 'sm:order-2 border-amber-200/80 -translate-y-4 ring-4 ring-amber-500/5' : 
                                            isSecond ? 'sm:order-1 border-slate-200/80' : 
                                            'sm:order-3 border-amber-600/20'
                                        }`}
                                    >
                                        {/* Rank badge */}
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm mb-3 shadow-inner ${
                                            isFirst ? 'bg-amber-400 text-white shadow-amber-300' :
                                            isSecond ? 'bg-slate-300 text-slate-700 shadow-slate-200' :
                                            'bg-amber-600 text-white shadow-amber-500'
                                        }`}>
                                            {ath.rank}
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl mb-3 shadow-sm">
                                            {ath.name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Name */}
                                        <p className="font-bold text-gray-900 text-sm text-center truncate w-full">{ath.name}</p>
                                        
                                        {/* Belt */}
                                        <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${getBeltBadgeStyle(ath.belt_rank)}`}>
                                            <span className="inline-block h-1.5 w-3 rounded-sm border shrink-0" style={getBeltStyle(ath.belt_rank)} />
                                            {ath.belt_rank}
                                        </span>

                                        {/* Points */}
                                        <div className="mt-4 bg-indigo-50/50 border border-indigo-100/30 rounded-xl px-3.5 py-1.5 text-center">
                                            <span className="text-xs font-black text-indigo-600">⭐ {ath.points} pts</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Remainder list */}
                    <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-slate-50/30">
                            <h3 className="text-sm font-bold text-gray-800">Athlete Rankings</h3>
                        </div>

                        {filteredLeaderboard.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 italic text-sm">
                                No athletes found matching your search.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {rest.map((ath, index) => {
                                    const rank = index + 4;
                                    return (
                                        <div key={ath.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
                                            <div className="flex items-center gap-4 min-w-0">
                                                {/* Rank position */}
                                                <span className="w-6 text-xs font-black text-gray-400 text-center shrink-0">
                                                    #{rank}
                                                </span>
                                                
                                                {/* Icon */}
                                                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 shadow-sm">
                                                    {ath.name.charAt(0).toUpperCase()}
                                                </div>

                                                {/* Details */}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{ath.name}</p>
                                                    <span className="inline-block text-[8px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
                                                        {ath.belt_rank}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Points */}
                                            <span className="inline-flex items-center gap-1 bg-amber-50/50 border border-amber-100 rounded-lg px-2.5 py-1 text-xs font-black text-amber-700 shadow-sm">
                                                ⭐ {ath.points} pts
                                            </span>
                                        </div>
                                    );
                                })}

                                {/* Handle cases where fewer than 4 athletes exist */}
                                {filteredLeaderboard.length <= 3 && rest.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 italic text-xs">
                                        All ranked athletes shown in the podium.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
