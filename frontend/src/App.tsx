import { useState } from 'react';
import { Search, Loader2, Factory, Link as LinkIcon, Building2, Lightbulb, TrendingUp, Cpu, CheckCircle2 } from 'lucide-react';

interface Signal {
  finding: string;
  signal_type: string;
  source_url: string;
  confidence: string;
}

interface CompanyIntelligence {
  company_name: string;
  industry: string;
  overview: string;
  signals: Signal[];
}

interface Opportunity {
  title: string;
  business_problem: string;
  potential_ai_solution: string;
  business_value: string;
  complexity: string;
  confidence: string;
}

function App() {
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  
  const [loadingIntel, setLoadingIntel] = useState(false);
  const [intelResult, setIntelResult] = useState<CompanyIntelligence | null>(null);
  
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[] | null>(null);

  const [selectedOpp, setSelectedOpp] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website || !linkedin) {
      setError('Please provide both website and LinkedIn URLs.');
      return;
    }

    setLoadingIntel(true);
    setError('');
    setIntelResult(null);
    setOpportunities(null);
    setSelectedOpp(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_website: website, linkedin_url: linkedin }),
      });

      if (!response.ok) {
        let errorMsg = 'Failed to fetch company intelligence.';
        try {
          const errData = await response.json();
          if (errData.detail) errorMsg = errData.detail;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setIntelResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoadingIntel(false);
    }
  };

  const handleGenerateOpps = async () => {
    if (!intelResult) return;
    setLoadingOpps(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intelResult),
      });

      if (!response.ok) {
        let errorMsg = 'Failed to generate opportunities.';
        try {
          const errData = await response.json();
          if (errData.detail) errorMsg = errData.detail;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setOpportunities(data.opportunities);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoadingOpps(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>FDE Demo Factory</h1>
        <p>Accelerate your client prep with AI-powered company intelligence.</p>
      </header>

      <div className="glass-panel">
        <form onSubmit={handleResearch}>
          <div className="form-group">
            <label htmlFor="website">Company Website URL</label>
            <div style={{ position: 'relative' }}>
              <LinkIcon size={20} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: '#94a3b8' }} />
              <input
                id="website"
                type="url"
                className="form-input"
                style={{ paddingLeft: '3rem' }}
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="linkedin">Company LinkedIn URL</label>
            <div style={{ position: 'relative' }}>
              <Building2 size={20} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: '#94a3b8' }} />
              <input
                id="linkedin"
                type="url"
                className="form-input"
                style={{ paddingLeft: '3rem' }}
                placeholder="https://linkedin.com/company/example"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
          </div>

          {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

          <button type="submit" className="btn" disabled={loadingIntel || loadingOpps}>
            {loadingIntel ? (
              <><Loader2 className="spinner" size={20} /> Researching Company...</>
            ) : (
              <><Search size={20} /> Generate Intelligence</>
            )}
          </button>
        </form>
      </div>

      {intelResult && (
        <div className="glass-panel animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Factory color="#8b5cf6" />
                {intelResult.company_name}
              </h2>
              <span className="badge">{intelResult.industry}</span>
            </div>
          </div>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '2.5rem' }}>
            {intelResult.overview}
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Extracted Signals
          </h3>
          
          <div className="results-container" style={{ marginBottom: '2rem' }}>
            {intelResult.signals.map((signal, idx) => (
              <div key={idx} className={`signal-card ${signal.signal_type}`}>
                <div className="signal-header">
                  <span className={`signal-type ${signal.signal_type}`}>
                    {signal.signal_type}
                  </span>
                  <span className="signal-confidence">Confidence: <strong>{signal.confidence}</strong></span>
                </div>
                <div className="signal-finding">{signal.finding}</div>
              </div>
            ))}
          </div>

          {!opportunities && (
            <button className="btn" onClick={handleGenerateOpps} disabled={loadingOpps} style={{ background: '#8b5cf6' }}>
              {loadingOpps ? (
                <><Loader2 className="spinner" size={20} /> Discovering Opportunities...</>
              ) : (
                <><Lightbulb size={20} /> Brainstorm AI Opportunities</>
              )}
            </button>
          )}
        </div>
      )}

      {opportunities && (
        <div className="glass-panel animate-in">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Lightbulb color="#f59e0b" />
            Discovered AI Opportunities
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            Based on the intelligence gathered, here are the top recommended automation use cases. Select one to proceed to the Demo Blueprint phase.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {opportunities.map((opp, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedOpp(idx)}
                style={{
                  background: selectedOpp === idx ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                  border: `2px solid ${selectedOpp === idx ? '#3b82f6' : 'transparent'}`,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.4rem', color: selectedOpp === idx ? '#60a5fa' : '#f8fafc', margin: 0 }}>
                    {opp.title}
                  </h3>
                  {selectedOpp === idx && <CheckCircle2 color="#3b82f6" />}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Business Problem</h4>
                    <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.5' }}>{opp.business_problem}</p>
                  </div>
                  <div>
                    <h4 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>AI Solution</h4>
                    <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.5' }}>{opp.potential_ai_solution}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={18} color="#10b981" />
                    <span style={{ color: '#94a3b8' }}>Value: <strong style={{ color: '#f8fafc' }}>{opp.business_value}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Cpu size={18} color="#8b5cf6" />
                    <span style={{ color: '#94a3b8' }}>Complexity: <strong style={{ color: '#f8fafc' }}>{opp.complexity}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedOpp !== null && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button className="btn" style={{ background: '#10b981', padding: '1rem 3rem', fontSize: '1.1rem' }}>
                Create Demo Blueprint 🚀
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
