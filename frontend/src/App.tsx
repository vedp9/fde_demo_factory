import { useState } from 'react';
import { Search, Loader2, Factory, Link as LinkIcon, Building2 } from 'lucide-react';

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

function App() {
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompanyIntelligence | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website || !linkedin) {
      setError('Please provide both website and LinkedIn URLs.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Connect to the FastAPI backend
      const response = await fetch('http://127.0.0.1:8000/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_website: website,
          linkedin_url: linkedin,
        }),
      });

      if (!response.ok) {
        let errorMsg = 'Failed to fetch company intelligence.';
        try {
          const errData = await response.json();
          if (errData.detail) {
            errorMsg = errData.detail;
          }
        } catch (e) {
          // Ignore json parse error
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>FDE Demo Factory</h1>
        <p>Accelerate your client prep with AI-powered company intelligence.</p>
      </header>

      <div className="glass-panel">
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spinner" size={20} />
                Researching Company...
              </>
            ) : (
              <>
                <Search size={20} />
                Generate Intelligence
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="glass-panel animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Factory className="badge-icon" color="#8b5cf6" />
                {result.company_name}
              </h2>
              <span className="badge">{result.industry}</span>
            </div>
          </div>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '2.5rem' }}>
            {result.overview}
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            Extracted Signals
          </h3>
          
          <div className="results-container">
            {result.signals.map((signal, idx) => (
              <div key={idx} className={`signal-card ${signal.signal_type}`}>
                <div className="signal-header">
                  <span className={`signal-type ${signal.signal_type}`}>
                    {signal.signal_type}
                  </span>
                  <span className="signal-confidence">
                    Confidence: <strong>{signal.confidence}</strong>
                  </span>
                </div>
                <div className="signal-finding">{signal.finding}</div>
                <div>
                  <a href={signal.source_url} target="_blank" rel="noreferrer" className="signal-source">
                    Source URL ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
