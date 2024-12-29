;; Dream Data Storage Contract

(define-map dream-reports
  { report-id: uint }
  {
    dreamer: principal,
    encrypted-report: (buff 1024),
    encrypted-biometrics: (buff 512),
    timestamp: uint
  }
)

(define-data-var last-report-id uint u0)

(define-public (submit-dream-report (encrypted-report (buff 1024)) (encrypted-biometrics (buff 512)))
  (let
    (
      (new-id (+ (var-get last-report-id) u1))
    )
    (map-set dream-reports
      { report-id: new-id }
      {
        dreamer: tx-sender,
        encrypted-report: encrypted-report,
        encrypted-biometrics: encrypted-biometrics,
        timestamp: block-height
      }
    )
    (var-set last-report-id new-id)
    (ok new-id)
  )
)

(define-read-only (get-dream-report (report-id uint))
  (ok (map-get? dream-reports { report-id: report-id }))
)

(define-read-only (get-last-report-id)
  (ok (var-get last-report-id))
)

