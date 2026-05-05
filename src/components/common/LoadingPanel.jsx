function LoadingPanel({ label = 'Loading data' }) {
  return (
    <div className="work-card card">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3">
          <div className="spinner-border spinner-border-sm text-warning" role="status" />
          <div>
            <p className="mb-1 fw-bold">{label}</p>
            <p className="mb-0 text-muted-soft">
              Pulling the latest information into the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingPanel
