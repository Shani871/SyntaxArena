import React, { useState } from 'react';
import { Bell, Lock, Eye, Monitor, Volume2, Save, User, LogOut, Shield, Moon, Smartphone, Globe } from 'lucide-react';

export const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'NOTIFICATIONS' | 'PRIVACY'>('GENERAL');
    
    // Mock Settings State
    const [settings, setSettings] = useState({
        theme: 'dark',
        sound: true,
        animations: true,
        emailNotifs: true,
        pushNotifs: false,
        publicProfile: true,
        showActivity: true
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        // Mock save
        alert("Settings Saved!");
    };

    return (
        <div className="h-full w-full flex flex-col bg-[#1e1e1e] font-mono text-sm overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-700">
                <div className="w-full max-w-4xl mx-auto flex flex-col min-h-full pb-24">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
                            <Monitor className="text-cyber-blue" size={32} /> System Configuration
                        </h1>
                        <p className="text-[#858585] text-sm">Customize your SyntaxArena experience.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Tabs */}
                        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                            <button 
                                onClick={() => setActiveTab('GENERAL')}
                                className={`p-3 rounded text-left font-bold text-xs flex items-center gap-3 transition-colors ${activeTab === 'GENERAL' ? 'bg-[#252526] text-white border border-[#333]' : 'text-[#858585] hover:text-white hover:bg-[#252526]'}`}
                            >
                                <Monitor size={16} /> General
                            </button>
                            <button 
                                onClick={() => setActiveTab('NOTIFICATIONS')}
                                className={`p-3 rounded text-left font-bold text-xs flex items-center gap-3 transition-colors ${activeTab === 'NOTIFICATIONS' ? 'bg-[#252526] text-white border border-[#333]' : 'text-[#858585] hover:text-white hover:bg-[#252526]'}`}
                            >
                                <Bell size={16} /> Notifications
                            </button>
                            <button 
                                onClick={() => setActiveTab('PRIVACY')}
                                className={`p-3 rounded text-left font-bold text-xs flex items-center gap-3 transition-colors ${activeTab === 'PRIVACY' ? 'bg-[#252526] text-white border border-[#333]' : 'text-[#858585] hover:text-white hover:bg-[#252526]'}`}
                            >
                                <Lock size={16} /> Privacy & Security
                            </button>
                            
                            <div className="h-px bg-[#333] my-2"></div>
                            
                            <button className="p-3 rounded text-left font-bold text-xs flex items-center gap-3 text-red-400 hover:bg-red-900/10 transition-colors">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 bg-[#252526] border border-[#333] rounded-xl p-6 shadow-xl">
                            
                            {activeTab === 'GENERAL' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h2 className="text-lg font-bold text-white mb-4 border-b border-[#333] pb-2">Appearance</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#1e1e1e] rounded border border-[#333] text-cyber-blue"><Moon size={18} /></div>
                                                    <div>
                                                        <div className="text-white font-bold text-xs">Dark Mode</div>
                                                        <div className="text-[#858585] text-[10px]">Adjust interface contrast</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center bg-[#1e1e1e] rounded p-1 border border-[#333]">
                                                    <button 
                                                        onClick={() => setSettings({...settings, theme: 'dark'})}
                                                        className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${settings.theme === 'dark' ? 'bg-cyber-blue text-white' : 'text-[#555]'}`}
                                                    >
                                                        ON
                                                    </button>
                                                    <button 
                                                        onClick={() => setSettings({...settings, theme: 'light'})}
                                                        className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${settings.theme === 'light' ? 'bg-cyber-blue text-white' : 'text-[#555]'}`}
                                                    >
                                                        OFF
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#1e1e1e] rounded border border-[#333] text-cyber-neon"><Eye size={18} /></div>
                                                    <div>
                                                        <div className="text-white font-bold text-xs">Reduced Motion</div>
                                                        <div className="text-[#858585] text-[10px]">Disable complex animations</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggle('animations')}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.animations ? 'bg-green-500' : 'bg-[#444]'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.animations ? 'left-6' : 'left-1'}`}></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-white mb-4 border-b border-[#333] pb-2">Sound</h2>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#1e1e1e] rounded border border-[#333] text-cyber-purple"><Volume2 size={18} /></div>
                                                <div>
                                                    <div className="text-white font-bold text-xs">SFX Volume</div>
                                                    <div className="text-[#858585] text-[10px]">UI interactions and alerts</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggle('sound')}
                                                className={`w-10 h-5 rounded-full relative transition-colors ${settings.sound ? 'bg-green-500' : 'bg-[#444]'}`}
                                            >
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.sound ? 'left-6' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'NOTIFICATIONS' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h2 className="text-lg font-bold text-white mb-4 border-b border-[#333] pb-2">Alerts</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#1e1e1e] rounded border border-[#333] text-cyber-blue"><Globe size={18} /></div>
                                                    <div>
                                                        <div className="text-white font-bold text-xs">Email Notifications</div>
                                                        <div className="text-[#858585] text-[10px]">Weekly digest & challenges</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggle('emailNotifs')}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.emailNotifs ? 'bg-green-500' : 'bg-[#444]'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.emailNotifs ? 'left-6' : 'left-1'}`}></div>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#1e1e1e] rounded border border-[#333] text-cyber-purple"><Smartphone size={18} /></div>
                                                    <div>
                                                        <div className="text-white font-bold text-xs">Push Notifications</div>
                                                        <div className="text-[#858585] text-[10px]">Real-time battle invites</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggle('pushNotifs')}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.pushNotifs ? 'bg-green-500' : 'bg-[#444]'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.pushNotifs ? 'left-6' : 'left-1'}`}></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'PRIVACY' && (
                                <div className="space-y-8 animate-fade-in">
                                     <div>
                                        <h2 className="text-lg font-bold text-white mb-4 border-b border-[#333] pb-2">Visibility</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#1e1e1e] rounded border border-[#333] text-cyber-neon"><User size={18} /></div>
                                                    <div>
                                                        <div className="text-white font-bold text-xs">Public Profile</div>
                                                        <div className="text-[#858585] text-[10px]">Allow others to view your stats</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggle('publicProfile')}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.publicProfile ? 'bg-green-500' : 'bg-[#444]'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.publicProfile ? 'left-6' : 'left-1'}`}></div>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#1e1e1e] rounded border border-[#333] text-yellow-500"><Shield size={18} /></div>
                                                    <div>
                                                        <div className="text-white font-bold text-xs">Show Activity Status</div>
                                                        <div className="text-[#858585] text-[10px]">Display when you are online</div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggle('showActivity')}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.showActivity ? 'bg-green-500' : 'bg-[#444]'}`}
                                                >
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.showActivity ? 'left-6' : 'left-1'}`}></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-[#333] flex justify-end">
                                <button 
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-cyber-blue hover:bg-blue-600 text-white rounded font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
                                >
                                    <Save size={14} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};