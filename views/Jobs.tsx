import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Search, Filter, Building2, ExternalLink, Globe, CheckCircle2 } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract' | 'Part-time';
  salary: string;
  posted: string;
  tags: string[];
  logoColor: string;
  description: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Backend Engineering Intern',
    company: 'Vercel',
    location: 'Remote',
    type: 'Internship',
    salary: '$30 - $50 / hr',
    posted: '2 days ago',
    tags: ['Node.js', 'Next.js', 'Serverless'],
    logoColor: 'bg-black',
    description: "Join our core infrastructure team to build the next generation of serverless computing. You'll work on high-scale distributed systems."
  },
  {
    id: '2',
    title: 'Junior Go Developer',
    company: 'Uber',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    posted: '4 hours ago',
    tags: ['Golang', 'Microservices', 'Kafka'],
    logoColor: 'bg-slate-800',
    description: "We are looking for passionate engineers to work on our real-time dispatch systems. Experience with Go and concurrency patterns required."
  },
  {
    id: '3',
    title: 'Software Engineer - AI',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$180k - $250k',
    posted: '1 week ago',
    tags: ['Python', 'PyTorch', 'Rust'],
    logoColor: 'bg-green-600',
    description: "Help us build safe AGI. You will be optimizing inference pipelines and working on large-scale model training infrastructure."
  },
  {
    id: '4',
    title: 'Frontend Developer Intern',
    company: 'Airbnb',
    location: 'Remote',
    type: 'Internship',
    salary: '$40 - $60 / hr',
    posted: '3 days ago',
    tags: ['React', 'TypeScript', 'GraphQL'],
    logoColor: 'bg-red-500',
    description: "Create beautiful, accessible user experiences for millions of hosts and guests. Work with our design system team."
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Contract',
    salary: '$140k - $160k',
    posted: '5 days ago',
    tags: ['AWS', 'Kubernetes', 'Spinnaker'],
    logoColor: 'bg-red-700',
    description: "Maintain the reliability of the world's leading streaming service. Chaos engineering experience is a plus."
  },
  {
    id: '6',
    title: 'Full Stack Developer',
    company: 'Discord',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130k - $170k',
    posted: '1 day ago',
    tags: ['Elixir', 'React', 'Rust'],
    logoColor: 'bg-indigo-600',
    description: "Build the communication platform for communities. You will touch everything from the WebSocket gateway to the React client."
  }
];

export const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<'All' | 'Full-time' | 'Internship' | 'Contract'>('All');
  
  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = activeType === 'All' || job.type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] overflow-hidden font-mono text-sm">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-700">
            <div className="max-w-7xl mx-auto space-y-8 min-h-full flex flex-col pb-24">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Briefcase className="text-cyber-blue" size={32} /> Career Center
                        </h1>
                        <p className="text-[#858585] text-sm">Find your next role in tech. Curated opportunities for developers.</p>
                    </div>
                    <button className="bg-[#252526] hover:bg-[#333] text-white px-4 py-2 rounded-lg border border-[#333] text-xs font-bold flex items-center gap-2 transition-colors">
                        <ExternalLink size={14} /> Post a Job
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 bg-[#252526] p-4 rounded-xl border border-[#333] shadow-lg items-center">
                    <div className="flex-1 relative group w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] group-focus-within:text-cyber-blue transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by role, company, or tech stack..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-cyber-blue outline-none transition-all placeholder-[#555]"
                        />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                        {(['All', 'Full-time', 'Internship', 'Contract'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                                    activeType === type 
                                        ? 'bg-cyber-blue text-white border-cyber-blue' 
                                        : 'bg-[#1e1e1e] text-[#858585] border-[#333] hover:border-[#555] hover:text-white'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 auto-rows-fr">
                    {filteredJobs.map(job => (
                        <div key={job.id} className="bg-[#252526] border border-[#333] rounded-xl p-6 hover:border-cyber-blue hover:-translate-y-1 transition-all group relative overflow-hidden shadow-lg flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                {job.type === 'Internship' && <GraduationCapIcon />}
                            </div>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-lg ${job.logoColor} flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0`}>
                                    {job.company.slice(0, 1)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyber-blue transition-colors line-clamp-1">{job.title}</h3>
                                    <div className="text-sm text-[#ccc] font-medium flex items-center gap-1">
                                        <Building2 size={14} /> {job.company}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6 text-xs text-[#858585]">
                                <div className="flex items-center gap-1 bg-[#1e1e1e] px-2 py-1 rounded border border-[#333]">
                                    <MapPin size={12} /> {job.location}
                                </div>
                                <div className="flex items-center gap-1 bg-[#1e1e1e] px-2 py-1 rounded border border-[#333]">
                                    <Clock size={12} /> {job.type}
                                </div>
                                <div className="flex items-center gap-1 bg-[#1e1e1e] px-2 py-1 rounded border border-[#333] text-green-400 border-green-900/30">
                                    <DollarSign size={12} /> {job.salary}
                                </div>
                            </div>

                            <p className="text-[#858585] text-sm mb-6 flex-1 leading-relaxed">
                                {job.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#333]">
                                <div className="flex gap-2">
                                    {job.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] bg-[#333] text-[#ccc] px-2 py-1 rounded-full border border-[#444]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-xs text-[#555] font-medium">{job.posted}</div>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform bg-[#252526]/95 backdrop-blur-sm border-t border-[#333] flex justify-end">
                                 <button className="bg-cyber-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2 transition-colors">
                                    Apply Now <ExternalLink size={14} />
                                 </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-20 text-[#555] flex-1 flex flex-col justify-center">
                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold">No jobs found</p>
                        <p className="text-sm">Try adjusting your search terms or filters.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

const GraduationCapIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-neon">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
);