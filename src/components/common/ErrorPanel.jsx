function ErrorPanel({ message, onRetry }) {
  return (
    <div className="work-card card">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <p className="mb-1 fw-bold fs-5">Something needs attention</p>
            <p className="mb-0 text-muted-soft">
              {message || 'We could not complete that request.'}
            </p>
          </div>
          {onRetry ? (
            <button className="btn btn-gold rounded-pill px-4" onClick={onRetry} type="button">
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ErrorPanel
