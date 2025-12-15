import React, { useState, useRef, useEffect } from 'react';
import { Server, Database, Smartphone, Play, X, Cpu, Layers, Shield, Zap, Trash2, Settings, Activity, RotateCcw, AlertCircle } from 'lucide-react';

interface Node {
  id: string;
  type: 'client' | 'server' | 'database' | 'service' | 'cache' | 'queue' | 'firewall';
  label: string;
  x: number;
  y: number;
  status: 'online' | 'offline';
  latency: number;
}

export const Playground: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'client', label: 'Mobile App', x: 50, y: 150, status: 'online', latency: 10 },
    { id: '2', type: 'firewall', label: 'WAF', x: 250, y: 150, status: 'online', latency: 20 },
    { id: '3', type: 'server', label: 'API Gateway', x: 450, y: 150, status: 'online', latency: 45 },
    { id: '4', type: 'database', label: 'Primary DB', x: 700, y: 150, status: 'online', latency: 100 },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeSimNode, setActiveSimNode] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [packet, setPacket] = useState<{ start: Node, end: Node, progress: number, status: 'ok' | 'error' } | null>(null);

  // Dragging State
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to get selected node object
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const addNode = (type: Node['type']) => {
    const newNode: Node = {
        id: Date.now().toString(),
        type,
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        x: Math.random() * 200 + 50,
        y: Math.random() * 200 + 50,
        status: 'online',
        latency: type === 'database' ? 100 : type === 'cache' ? 5 : 50
    };
    setNodes([...nodes, newNode]);
    setLogs(prev => [...prev, `Added ${type} node.`]);
  };

  const removeNode = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    setLogs(prev => [...prev, `Removed node.`]);
  };

  const clearCanvas = () => {
      setNodes([]);
      setLogs(prev => [...prev, 'Canvas cleared.']);
      setSelectedNodeId(null);
  };

  const updateNode = (id: string, updates: Partial<Node>) => {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const simulateFlow = async () => {
    if (nodes.length < 2) return;
    
    setLogs(prev => [...prev, '--- Starting Request Trace ---']);
    const sortedNodes = [...nodes].sort((a, b) => a.x - b.x);

    for (let i = 0; i < sortedNodes.length; i++) {
        const node = sortedNodes[i];
        setActiveSimNode(node.id);
        
        // Check Status
        if (node.status === 'offline') {
            setLogs(prev => [...prev, `❌ Error: ${node.label} is unreachable (OFFLINE).`]);
            break; // Stop flow
        }

        setLogs(prev => [...prev, `Processing: ${node.label} (${node.latency}ms)...`]);
        await new Promise(r => setTimeout(r, Math.max(100, node.latency * 2))); // Visual delay proportional to latency
        
        // Packet animation to next node
        if (i < sortedNodes.length - 1) {
            const nextNode = sortedNodes[i+1];
            // Animate packet
            for (let p = 0; p <= 100; p+=5) {
                setPacket({ start: node, end: nextNode, progress: p, status: 'ok' });
                await new Promise(r => setTimeout(r, 10));
            }
            setPacket(null);
        } else {
             setLogs(prev => [...prev, '✅ Request completed successfully.']);
             await new Promise(r => setTimeout(r, 500));
        }
    }
    
    setActiveSimNode(null);
    setPacket(null);
    setLogs(prev => [...prev, '--- Trace Complete ---']);
  };

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent, id: string, x: number, y: number) => {
    e.stopPropagation();
    setSelectedNodeId(id);
    setDraggingId(id);
    setDragOffset({
        x: e.clientX - x,
        y: e.clientY - y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId && containerRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        setNodes(prev => prev.map(n => 
            n.id === draggingId ? { ...n, x: newX, y: newY } : n
        ));
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const renderConnection = (nodeA: Node, nodeB: Node) => {
      // Calculate Bezier curve
      const startX = nodeA.x + 72; 
      const startY = nodeA.y + 35; 
      const endX = nodeB.x + 72;
      const endY = nodeB.y + 35;
      
      const dist = Math.abs(endX - startX);
      const cp1x = startX + dist * 0.5;
      const cp1y = startY;
      const cp2x = endX - dist * 0.5;
      const cp2y = endY;

      const pathData = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
      const isPacketActive = packet && packet.start.id === nodeA.id && packet.end.id === nodeB.id;

      return (
          <g key={`${nodeA.id}-${nodeB.id}`}>
             <path d={pathData} stroke="#333" strokeWidth="4" fill="none" />
             <path d={pathData} stroke={nodeA.status === 'offline' ? '#ef4444' : '#555'} strokeWidth="2" fill="none" strokeDasharray="5,5" className={nodeA.status === 'online' ? "animate-pulse" : ""} opacity="0.6"/>
             
             {/* Packet Animation */}
             {isPacketActive && (
                 <circle r="6" fill="#10b981" filter="url(#glow)">
                     <animateMotion 
                        dur="0.3s" 
                        repeatCount="1"
                        path={pathData}
                        fill="freeze"
                     />
                 </circle>
             )}
          </g>
      );
  };

  // Sort nodes for simple left-to-right connections
  const sortedNodesForLines = [...nodes].sort((a, b) => a.x - b.x);

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col font-mono text-sm" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Toolbar */}
      <div className="h-16 bg-[#252526] border-b border-[#333] flex items-center justify-between px-6 shadow-md z-20 shrink-0">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyber-blue/10 rounded flex items-center justify-center border border-cyber-blue/20">
                 <Cpu className="text-cyber-blue" size={20} />
              </div>
              <div className="hidden md:block">
                 <div className="font-bold text-white text-lg tracking-tight leading-none">Backend Architect</div>
                 <div className="text-[10px] text-[#858585] mt-1">Design & Simulate Infrastructure</div>
              </div>
          </div>
          
          <div className="flex gap-2">
              <div className="flex bg-[#1e1e1e] p-1 rounded border border-[#333] gap-1 overflow-x-auto max-w-[200px] md:max-w-none no-scrollbar">
                  <button onClick={() => addNode('client')} className="p-2 hover:bg-[#333] text-[#ccc] rounded transition-colors group relative shrink-0" title="Client">
                      <Smartphone size={18}/>
                  </button>
                  <button onClick={() => addNode('firewall')} className="p-2 hover:bg-[#333] text-[#ccc] rounded transition-colors group relative shrink-0" title="Firewall">
                      <Shield size={18}/>
                  </button>
                  <button onClick={() => addNode('server')} className="p-2 hover:bg-[#333] text-[#ccc] rounded transition-colors group relative shrink-0" title="Server">
                      <Server size={18}/>
                  </button>
                  <button onClick={() => addNode('service')} className="p-2 hover:bg-[#333] text-[#ccc] rounded transition-colors group relative shrink-0" title="Microservice">
                      <Cpu size={18}/>
                  </button>
                  <button onClick={() => addNode('cache')} className="p-2 hover:bg-[#333] text-[#ccc] rounded transition-colors group relative shrink-0" title="Cache">
                      <Layers size={18}/>
                  </button>
                  <button onClick={() => addNode('queue')} className="p-2 hover:bg-[#333] text-[#ccc] rounded transition-colors group relative shrink-0" title="Queue">
                      <Activity size={18}/>
                  </button>
                  <button onClick={() => addNode('database')} className="p-2 hover:bg-[#333] text-[#ccc] rounded transition-colors group relative shrink-0" title="Database">
                      <Database size={18}/>
                  </button>
              </div>

              <div className="w-px h-10 bg-[#444] mx-2 self-center hidden md:block"></div>
              
              <button 
                onClick={simulateFlow} 
                disabled={!!activeSimNode || nodes.length < 2}
                className={`px-4 md:px-6 bg-cyber-neon/10 hover:bg-cyber-neon text-cyber-neon hover:text-[#1e1e1e] border border-cyber-neon/50 hover:border-cyber-neon rounded flex items-center gap-2 font-bold transition-all ${activeSimNode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Play size={16} fill="currentColor" /> <span className="hidden md:inline">{activeSimNode ? 'Running...' : 'Simulate'}</span>
              </button>
              
              <button 
                onClick={clearCanvas}
                className="px-3 hover:bg-red-900/20 text-[#858585] hover:text-red-400 rounded transition-colors border border-transparent hover:border-red-900/30"
                title="Clear Canvas"
              >
                  <RotateCcw size={16} />
              </button>
          </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Canvas Area */}
          <div 
            ref={containerRef}
            className="flex-1 relative bg-[#1e1e1e] overflow-hidden cursor-crosshair order-2 lg:order-1"
            onMouseMove={handleMouseMove}
            onMouseDown={() => setSelectedNodeId(null)}
          >
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#666 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              {/* Definitions for filters */}
              <svg className="absolute w-0 h-0">
                  <defs>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                          <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                      </filter>
                  </defs>
              </svg>

              {/* Connections Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                  {sortedNodesForLines.slice(0, -1).map((node, i) => 
                      renderConnection(node, sortedNodesForLines[i+1])
                  )}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`absolute w-36 bg-[#252526] rounded-lg border-2 shadow-xl flex flex-col items-center p-0 cursor-grab active:cursor-grabbing transition-all group
                        ${selectedNodeId === node.id ? 'border-cyber-blue z-20 ring-4 ring-cyber-blue/20' : 'border-[#444] z-10 hover:border-[#666]'}
                        ${activeSimNode === node.id ? 'shadow-[0_0_30px_rgba(16,185,129,0.4)] border-cyber-neon scale-105 transition-transform duration-300 z-30' : ''}
                        ${node.status === 'offline' ? 'opacity-70 grayscale border-red-900' : ''}
                    `}
                    style={{ 
                        left: node.x, 
                        top: node.y,
                        transition: draggingId === node.id ? 'none' : 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, node.id, node.x, node.y)}
                  >
                      {/* Node Header */}
                      <div className={`w-full p-3 flex justify-center rounded-t-md transition-colors ${
                          node.status === 'offline' ? 'bg-red-900/30' : 
                          activeSimNode === node.id ? 'bg-cyber-neon text-[#1e1e1e]' : 'bg-[#333] text-[#ccc]'
                      }`}>
                          {node.type === 'client' && <Smartphone size={20} />}
                          {node.type === 'server' && <Server size={20} />}
                          {node.type === 'database' && <Database size={20} />}
                          {node.type === 'service' && <Cpu size={20} />}
                          {node.type === 'cache' && <Layers size={20} />}
                          {node.type === 'queue' && <Activity size={20} />}
                          {node.type === 'firewall' && <Shield size={20} />}
                      </div>
                      
                      <div className="p-3 w-full text-center bg-[#252526] rounded-b-lg">
                        <div className="text-xs font-bold text-white mb-1 truncate">{node.label}</div>
                        <div className="flex justify-between items-center text-[10px] text-[#666] uppercase">
                            <span>{node.type}</span>
                            {node.status === 'offline' && <span className="text-red-500 font-bold flex items-center gap-1"><AlertCircle size={8}/> DOWN</span>}
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></div>
                  </div>
              ))}
          </div>

          {/* Right Sidebar: Properties & Logs */}
          <div className="w-full lg:w-80 h-1/3 lg:h-full border-t lg:border-t-0 lg:border-l border-[#333] bg-[#252526] flex flex-col z-20 shadow-xl order-1 lg:order-2">
              
              {/* Properties Panel */}
              <div className="border-b border-[#333] bg-[#2d2d2d]">
                  <div className="px-4 py-3 text-xs font-bold text-[#858585] uppercase tracking-wider flex items-center gap-2">
                      <Settings size={12} /> Properties
                  </div>
                  
                  {selectedNode ? (
                      <div className="p-4 space-y-4 bg-[#252526]">
                          <div>
                              <label className="text-xs text-[#858585] block mb-1">Label</label>
                              <input 
                                type="text" 
                                value={selectedNode.label} 
                                onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                                className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1 text-xs text-white focus:border-cyber-blue outline-none"
                              />
                          </div>
                          
                          <div className="flex gap-4">
                              <div className="flex-1">
                                  <label className="text-xs text-[#858585] block mb-1">Status</label>
                                  <div className="flex bg-[#1e1e1e] rounded p-1 border border-[#333]">
                                      <button 
                                        onClick={() => updateNode(selectedNode.id, { status: 'online' })}
                                        className={`flex-1 text-[10px] font-bold py-1 rounded transition-colors ${selectedNode.status === 'online' ? 'bg-green-600 text-white' : 'text-[#666] hover:bg-[#333]'}`}
                                      >
                                          ONLINE
                                      </button>
                                      <button 
                                        onClick={() => updateNode(selectedNode.id, { status: 'offline' })}
                                        className={`flex-1 text-[10px] font-bold py-1 rounded transition-colors ${selectedNode.status === 'offline' ? 'bg-red-600 text-white' : 'text-[#666] hover:bg-[#333]'}`}
                                      >
                                          DOWN
                                      </button>
                                  </div>
                              </div>
                          </div>

                          <div>
                              <label className="text-xs text-[#858585] block mb-1">Simulated Latency ({selectedNode.latency}ms)</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="1000" 
                                step="10"
                                value={selectedNode.latency}
                                onChange={(e) => updateNode(selectedNode.id, { latency: parseInt(e.target.value) })}
                                className="w-full accent-cyber-blue h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                              />
                          </div>
                          
                          <button 
                            onClick={() => removeNode(selectedNode.id)}
                            className="w-full mt-2 py-2 bg-red-900/20 text-red-400 border border-red-900/30 rounded text-xs font-bold hover:bg-red-900/40 flex items-center justify-center gap-2"
                          >
                              <Trash2 size={12} /> Delete Node
                          </button>
                      </div>
                  ) : (
                      <div className="p-8 text-center text-[#555] text-xs italic">
                          Select a node to configure properties.
                      </div>
                  )}
              </div>

              {/* Logs */}
              <div className="flex-1 flex flex-col min-h-0">
                  <div className="px-4 py-3 bg-[#2d2d2d] border-b border-[#333] border-t border-[#333] text-xs font-bold text-[#858585] uppercase tracking-wider flex items-center justify-between">
                      <span>Console Output</span>
                      <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-[#d4d4d4] space-y-2 scroll-smooth bg-[#1e1e1e]">
                      {logs.length === 0 && <div className="text-[#555] italic text-center mt-4">System ready.<br/>Drag nodes to arrange.<br/>Press Simulate.</div>}
                      {logs.map((log, i) => (
                          <div key={i} className="flex gap-2 animate-fade-in border-l-2 border-[#333] pl-2 hover:border-cyber-blue transition-colors">
                              <span className="text-cyber-blue select-none">{'>'}</span>
                              <span className={log.includes('Error') ? 'text-red-400' : ''}>{log}</span>
                          </div>
                      ))}
                      <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};