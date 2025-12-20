import React, { useState } from 'react';
import { Upload, FileText, Sparkles, Download, ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';
import { GameMode } from '../types';

interface ResumeBuilderProps {
    setMode: (mode: GameMode) => void;
}

interface ResumeData {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: Array<{
        company: string;
        title: string;
        duration: string;
        description: string[];
    }>;
    education: Array<{
        school: string;
        degree: string;
        year: string;
    }>;
    skills: string[];
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
    }>;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ setMode }) => {
    const [step, setStep] = useState<'choice' | 'upload' | 'form' | 'preview'>('choice');
    const [isUploading, setIsUploading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/resume/parse', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                // Parse the JSON data
                const parsedData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
                setResumeData(parsedData);
                setStep('preview');
            } else {
                setUploadError(result.error || 'Failed to parse resume');
            }
        } catch (error) {
            setUploadError('Error uploading file. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleEnhance = async () => {
        if (!resumeData) return;

        setIsEnhancing(true);

        try {
            const response = await fetch('http://localhost:8080/api/resume/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: JSON.stringify(resumeData) }),
            });

            const result = await response.json();

            if (result.success) {
                const enhancedData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
                setResumeData(enhancedData);
            }
        } catch (error) {
            console.error('Enhancement error:', error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleManualEntry = () => {
        setResumeData({
            name: '',
            email: '',
            phone: '',
            location: '',
            summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: [],
        });
        setStep('form');
    };

    // Choice Screen
    if (step === 'choice') {
        return (
            <div className="h-full w-full flex flex-col bg-[#0a0a0b] text-white overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-[#27272a]">
                    <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        Resume Builder
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Create a professional resume powered by AI</p>
                </div>

                {/* Choice Cards */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                        {/* Upload Option */}
                        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162d] rounded-2xl border border-purple-500/20 p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all cursor-pointer"
                            onClick={() => setStep('upload')}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={32} className="text-purple-400" />
                                </div>

                                <h2 className="text-2xl font-bold mb-2">Upload Existing Resume</h2>
                                <p className="text-gray-400 mb-6">
                                    Upload your current resume (PDF, PNG, JPG) and let AI extract and enhance the information
                                </p>

                                <div className="flex items-center gap-2 text-purple-400 font-bold">
                                    <span>Get Started</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* Manual Entry Option */}
                        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16162d] rounded-2xl border border-blue-500/20 p-8 relative overflow-hidden group hover:border-blue-500/40 transition-all cursor-pointer"
                            onClick={handleManualEntry}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FileText size={32} className="text-blue-400" />
                                </div>

                                <h2 className="text-2xl font-bold mb-2">Create from Scratch</h2>
                                <p className="text-gray-400 mb-6">
                                    Start with a blank canvas and fill in your details manually with AI assistance
                                </p>

                                <div className="flex items-center gap-2 text-blue-400 font-bold">
                                    <span>Get Started</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Upload Screen
    if (step === 'upload') {
        return (
            <div className="h-full w-full flex flex-col bg-[#0a0a0b] text-white overflow-y-auto">
                <div className="p-6 border-b border-[#27272a]">
                    <button onClick={() => setStep('choice')} className="text-gray-400 hover:text-white mb-4">
                        ← Back
                    </button>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Upload Your Resume
                    </h1>
                </div>

                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full">
                        <label className="block">
                            <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-12 text-center hover:border-purple-500/50 transition-all cursor-pointer bg-[#1e1e1e]/30">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />

                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 size={48} className="text-purple-400 animate-spin" />
                                        <p className="text-gray-400">Analyzing your resume...</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={48} className="text-purple-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Drop your resume here</h3>
                                        <p className="text-gray-400 mb-4">or click to browse</p>
                                        <p className="text-sm text-gray-500">Supports PDF, PNG, JPG (Max 10MB)</p>
                                    </>
                                )}
                            </div>
                        </label>

                        {uploadError && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                                <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-400 font-bold">Upload Failed</p>
                                    <p className="text-gray-400 text-sm">{uploadError}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Preview Screen
    if (step === 'preview' && resumeData) {
        return (
            <div className="h-full w-full flex flex-col bg-[#0a0a0b] text-white overflow-y-auto">
                <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Your Resume
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Review and enhance your resume</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleEnhance}
                            disabled={isEnhancing}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {isEnhancing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            <span>{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
                        </button>
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2 transition-colors">
                            <Download size={16} />
                            <span>Export PDF</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto bg-white text-black p-12 rounded-lg shadow-2xl">
                        {/* Name & Contact */}
                        <div className="border-b-2 border-gray-800 pb-4 mb-6">
                            <h1 className="text-4xl font-bold mb-2">{resumeData.name || 'Your Name'}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {resumeData.email && <span>{resumeData.email}</span>}
                                {resumeData.phone && <span>{resumeData.phone}</span>}
                                {resumeData.location && <span>{resumeData.location}</span>}
                            </div>
                        </div>

                        {/* Summary */}
                        {resumeData.summary && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-2 text-gray-800">PROFESSIONAL SUMMARY</h2>
                                <p className="text-gray-700">{resumeData.summary}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {resumeData.experience && resumeData.experience.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-3 text-gray-800">EXPERIENCE</h2>
                                {resumeData.experience.map((exp, idx) => (
                                    <div key={idx} className="mb-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                            <span className="text-sm text-gray-600">{exp.duration}</span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{exp.company}</p>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            {exp.description.map((desc, i) => (
                                                <li key={i}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Education */}
                        {resumeData.education && resumeData.education.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-3 text-gray-800">EDUCATION</h2>
                                {resumeData.education.map((edu, idx) => (
                                    <div key={idx} className="mb-2">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-900">{edu.degree}</span>
                                            <span className="text-gray-600">{edu.year}</span>
                                        </div>
                                        <p className="text-gray-700">{edu.school}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Skills */}
                        {resumeData.skills && resumeData.skills.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-3 text-gray-800">SKILLS</h2>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {resumeData.projects && resumeData.projects.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold mb-3 text-gray-800">PROJECTS</h2>
                                {resumeData.projects.map((project, idx) => (
                                    <div key={idx} className="mb-3">
                                        <h3 className="font-bold text-gray-900">{project.name}</h3>
                                        <p className="text-gray-700 mb-1">{project.description}</p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Technologies:</strong> {project.technologies.join(', ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
