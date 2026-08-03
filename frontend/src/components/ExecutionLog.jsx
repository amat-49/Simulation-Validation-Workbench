function ExecutionLog({ logs }) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h3>Execution Log</h3>
          <p>Live simulation events will appear here.</p>
        </div>
      </div>

      <div className="log-console" aria-live="polite">
        {logs.length === 0 ? (
          <p className="empty-log">No execution events yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="log-entry">
              <span className="log-time">[{log.timestamp}]</span>

              <span className={`log-level ${log.level.toLowerCase()}`}>
                {log.level}
              </span>

              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExecutionLog;