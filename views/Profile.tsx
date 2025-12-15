import React, { useState, useRef } from 'react';
import { MOCK_USER } from '../constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Trophy, Flame, Target, Edit2, Camera, Smile, Type, Upload, X, Check, Activity } from 'lucide-react';

export const Profile: React.FC = () => {
  // Profile State
  const [profile, setProfile] = useState({
    username: MOCK_USER.username,
    title: "Lvl 12 Architect",
    bio: "Passionate backend developer exploring the depths of system design and distributed architectures.",
    avatarType: 'INITIALS' as 'INITIALS' | 'EMOJI' | 'IMAGE',
    avatarValue: MOCK_USER.username.slice(0, 2).toUpperCase(), // Default initials
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats Data
  const radarData = [
    { subject: 'Logic', A: MOCK_USER.logicRating, fullMark: 2000 },
    { subject: 'Syntax', A: MOCK_USER.codingRating, fullMark: 2000 },
    { subject: 'Speed', A: 1300, fullMark: 2000 },
    { subject: 'Debug', A: 1100, fullMark: 2000 },
    { subject: 'System Design', A: 900, fullMark: 2000 },
  ];

  // Enhanced Activity Data (Stacked)
  const activityData = [
    { day: 'Mon', battles: 2, tutorials: 1, practice: 1, total: 4 },
    { day: 'Tue', battles: 3, tutorials: 2, practice: 2, total: 7 },
    { day: 'Wed', battles: 0, tutorials: 1, practice: 1, total: 2 },
    { day: 'Thu', battles: 5, tutorials: 3, practice: 4, total: 12 },
    { day: 'Fri', battles: 2, tutorials: 4, practice: 2, total: 8 },
    { day: 'Sat', battles: 6, tutorials: 5, practice: 4, total: 15 },
    { day: 'Sun', battles: 1, tutorials: 2, practice: 2, total: 5 },
  ];

  const handleEditClick = () => {
      setEditForm({...profile});
      setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatarType: 'IMAGE', avatarValue: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAvatar = (type: string, value: string, size: 'large' | 'small' = 'large') => {
    const sizeClasses = size === 'large' ? 'w-24 h-24 text-3xl' : 'w-16 h-16 text-xl';
    
    if (type === 'IMAGE') {
        return (
            <img 
                src={value} 
                alt="Profile" 
                className={`${size === 'large' ? 'w-24 h-24' : 'w-16 h-16'} rounded-full object-cover border-2 border-[#333] shadow-lg`} 
            />
        );
    }
    
    if (type === 'EMOJI') {
        return (
            <div className={`${sizeClasses} rounded-full bg-[#252526] border-2 border-[#333] flex items-center justify-center shadow-lg select-none`}>
                {value}
            </div>
        );
    }

    // Default Initials
    return (
        <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg border-2 border-[#333]`}>
            {value.substring(0, 3).toUpperCase()}
        </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] font-mono overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-700">
          <div className="w-full space-y-8 max-w-7xl mx-auto flex flex-col min-h-full pb-24">
              
              {/* Profile Header Card */}
              <div className="bg-[#252526] p-6 md:p-8 rounded-xl border border-[#333] shadow-xl relative overflow-hidden group shrink-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                       <button 
                          onClick={handleEditClick}
                          className="p-2 bg-[#333] hover:bg-cyber-blue text-white rounded-full transition-colors shadow-lg"
                          title="Edit Profile"
                       >
                           <Edit2 size={16} />
                       </button>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-0">
                      <div className="relative group/avatar cursor-pointer" onClick={handleEditClick}>
                          {renderAvatar(profile.avatarType, profile.avatarValue)}
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                              <Camera size={24} className="text-white" />
                          </div>
                      </div>
                      
                      <div className="text-center md:text-left flex-1">
                          <h1 className="text-3xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">
                              {profile.username}
                              <span className="text-xs bg-cyber-blue/20 text-cyber-blue px-2 py-0.5 rounded border border-cyber-blue/30 font-mono">PRO</span>
                          </h1>
                          <p className="text-cyber-purple font-bold text-sm mb-3">{profile.title}</p>
                          <p className="text-[#858585] text-sm max-w-xl leading-relaxed">{profile.bio}</p>
                          
                          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                              <div className="bg-[#1e1e1e] px-3 py-1.5 rounded border border-[#333] flex items-center gap-2 text-xs text-[#ccc]">
                                  <Trophy size={14} className="text-yellow-500" /> Rank #42
                              </div>
                              <div className="bg-[#1e1e1e] px-3 py-1.5 rounded border border-[#333] flex items-center gap-2 text-xs text-[#ccc]">
                                  <Flame size={14} className="text-orange-500" /> {MOCK_USER.streak} Day Streak
                              </div>
                              <div className="bg-[#1e1e1e] px-3 py-1.5 rounded border border-[#333] flex items-center gap-2 text-xs text-[#ccc]">
                                  <Target size={14} className="text-blue-500" /> 187 Solved
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                  {/* Radar Chart: Skill Breakdown */}
                  <div className="bg-[#252526] p-6 rounded-xl border border-[#333] shadow-lg flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
                         <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity size={18} className="text-cyber-purple" /> Skill Matrix
                         </h3>
                     </div>
                     <div className="w-full" style={{ height: 350, minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 2000]} tick={false} axisLine={false} />
                            <Radar
                                name="User"
                                dataKey="A"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                fill="#8b5cf6"
                                fillOpacity={0.5}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }}
                                itemStyle={{ color: '#c4b5fd' }}
                            />
                            </RadarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Enhanced Weekly Activity Stacked Bar Chart */}
                  <div className="bg-[#252526] p-6 rounded-xl border border-[#333] shadow-lg flex flex-col">
                     <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
                         <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity size={18} className="text-cyber-blue" /> Weekly Breakdown
                         </h3>
                         <div className="text-[10px] text-[#858585] flex gap-3">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyber-blue"></div> Battle</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyber-purple"></div> Tutorial</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Practice</div>
                         </div>
                     </div>
                     <div className="w-full" style={{ height: 350, minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 12 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    hide 
                                />
                                <Tooltip 
                                    cursor={{fill: '#333', opacity: 0.2}}
                                    contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    labelStyle={{ color: '#fff', marginBottom: '0.5rem' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="battles" name="Battles" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={32} />
                                <Bar dataKey="tutorials" name="Tutorials" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} barSize={32} />
                                <Bar dataKey="practice" name="Practice" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up mx-4">
                <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#252526]">
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <Edit2 size={16} className="text-cyber-blue"/> Edit Profile
                    </h2>
                    <button onClick={() => setIsEditing(false)} className="text-[#858585] hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Avatar Selection */}
                    <div>
                        <label className="block text-xs font-bold text-[#858585] uppercase mb-3">Avatar Type</label>
                        <div className="flex gap-2 mb-4">
                             <button 
                                onClick={() => setEditForm(prev => ({...prev, avatarType: 'INITIALS'}))}
                                className={`flex-1 py-2 text-xs font-bold rounded border transition-all flex items-center justify-center gap-2 ${editForm.avatarType === 'INITIALS' ? 'bg-cyber-blue text-white border-cyber-blue' : 'bg-[#252526] text-[#858585] border-[#333] hover:border-[#555]'}`}
                             >
                                <Type size={14} /> Initials
                             </button>
                             <button 
                                onClick={() => setEditForm(prev => ({...prev, avatarType: 'EMOJI'}))}
                                className={`flex-1 py-2 text-xs font-bold rounded border transition-all flex items-center justify-center gap-2 ${editForm.avatarType === 'EMOJI' ? 'bg-cyber-blue text-white border-cyber-blue' : 'bg-[#252526] text-[#858585] border-[#333] hover:border-[#555]'}`}
                             >
                                <Smile size={14} /> Emoji
                             </button>
                             <button 
                                onClick={() => setEditForm(prev => ({...prev, avatarType: 'IMAGE'}))}
                                className={`flex-1 py-2 text-xs font-bold rounded border transition-all flex items-center justify-center gap-2 ${editForm.avatarType === 'IMAGE' ? 'bg-cyber-blue text-white border-cyber-blue' : 'bg-[#252526] text-[#858585] border-[#333] hover:border-[#555]'}`}
                             >
                                <Camera size={14} /> Picture
                             </button>
                        </div>

                        {/* Avatar Input Area */}
                        <div className="bg-[#252526] p-4 rounded border border-[#333] flex items-center gap-4">
                             <div className="shrink-0">
                                 {renderAvatar(editForm.avatarType, editForm.avatarValue, 'small')}
                             </div>
                             
                             <div className="flex-1">
                                {editForm.avatarType === 'INITIALS' && (
                                    <div className="text-xs text-[#858585]">
                                        Initials are derived automatically from your username.
                                    </div>
                                )}
                                
                                {editForm.avatarType === 'EMOJI' && (
                                    <input 
                                        type="text"
                                        value={editForm.avatarValue}
                                        onChange={(e) => setEditForm({...editForm, avatarValue: e.target.value})}
                                        className="w-full bg-[#1e1e1e] border border-[#333] rounded px-3 py-2 text-white focus:border-cyber-blue outline-none text-xl"
                                        placeholder="Paste emojis here (e.g. 👾🚀)"
                                    />
                                )}

                                {editForm.avatarType === 'IMAGE' && (
                                    <div className="space-y-2">
                                        <input 
                                            type="text"
                                            value={editForm.avatarValue.startsWith('data:') ? '' : editForm.avatarValue}
                                            onChange={(e) => setEditForm({...editForm, avatarValue: e.target.value})}
                                            className="w-full bg-[#1e1e1e] border border-[#333] rounded px-3 py-2 text-white text-xs focus:border-cyber-blue outline-none"
                                            placeholder="Paste Image URL..."
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-[#555]">OR</span>
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1.5 bg-[#333] hover:bg-[#444] text-white text-xs rounded flex items-center gap-2 transition-colors"
                                            >
                                                <Upload size={12} /> Upload File
                                            </button>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>

                    {/* Text Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#858585] uppercase mb-1">Username</label>
                            <input 
                                type="text" 
                                value={editForm.username}
                                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                className="w-full bg-[#252526] border border-[#333] rounded px-3 py-2 text-white focus:border-cyber-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#858585] uppercase mb-1">Title</label>
                            <input 
                                type="text" 
                                value={editForm.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="w-full bg-[#252526] border border-[#333] rounded px-3 py-2 text-white focus:border-cyber-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#858585] uppercase mb-1">Bio</label>
                            <textarea 
                                value={editForm.bio}
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                className="w-full bg-[#252526] border border-[#333] rounded px-3 py-2 text-white focus:border-cyber-blue outline-none h-24 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-[#333] bg-[#252526] flex justify-end gap-3">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-xs font-bold text-[#858585] hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-cyber-blue hover:bg-blue-600 text-white text-xs font-bold rounded shadow-lg flex items-center gap-2 transition-all"
                    >
                        <Check size={14} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};