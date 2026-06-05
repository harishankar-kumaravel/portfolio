import React, { useState } from 'react';
import portfolioRaw from './data/portfolio.js?raw';

export default function Admin() {
  const [code, setCode] = useState(portfolioRaw);

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#94A3B8] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-[#06B6D4]/20 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC]">Portfolio Admin Console</h1>
            <p className="mt-2 text-sm">
              Because this is a blazing fast static site, changes are made by editing the data file directly. 
              Edit the content below and click "Download portfolio.js". Overwrite your local <code>src/data/portfolio.js</code> with the downloaded file.
            </p>
          </div>
          <button 
            onClick={handleDownload}
            className="px-6 py-3 bg-[#06B6D4] text-[#0B0E14] font-bold rounded-lg hover:bg-[#22d3ee] transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Download portfolio.js
          </button>
        </div>

        <div className="w-full bg-[#11151C] rounded-xl border border-[#06B6D4]/30 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="bg-[#161B22] px-4 py-2 border-b border-[#06B6D4]/30 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs font-mono text-[#06B6D4]">src/data/portfolio.js</span>
          </div>
          <textarea 
            className="w-full h-[70vh] bg-transparent p-6 text-sm font-mono text-[#F8FAFC] focus:outline-none resize-none leading-relaxed"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
        </div>
        
        <div className="mt-8 text-center text-xs">
          <a href="/" className="text-[#06B6D4] hover:underline">← Back to Portfolio</a>
        </div>
      </div>
    </div>
  );
}
