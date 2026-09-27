import React from 'react';
import PilotWorkspace from './pilot/PilotWorkspace';
import './App.css';

// Safe error boundary to catch and display component errors without full app collapse
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#0f172a', color: '#f8fafc', height: '100vh' }}>
          <h2>VERTIMAP SYSTEM EXCEPTION</h2>
          <p style={{ color: '#ef4444', marginTop: 8 }}>Runtime Error Detected:</p>
          <pre style={{ background: '#1e293b', padding: 12, borderRadius: 6, marginTop: 12, overflow: 'auto' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <PilotWorkspace />
      </ErrorBoundary>
    </div>
  );
}

export default App;