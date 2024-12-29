;; Peer Review Contract

(define-map reviews
  { report-id: uint, reviewer: principal }
  {
    score: uint,
    comment: (string-utf8 500),
    timestamp: uint
  }
)

(define-map review-counts
  { report-id: uint }
  { count: uint }
)

(define-constant min-reviews u3)
(define-constant max-score u10)

(define-public (submit-review (report-id uint) (score uint) (comment (string-utf8 500)))
  (begin
    (asserts! (<= score max-score) (err u400))
    (map-set reviews
      { report-id: report-id, reviewer: tx-sender }
      {
        score: score,
        comment: comment,
        timestamp: block-height
      }
    )
    (map-set review-counts
      { report-id: report-id }
      { count: (+ u1 (default-to u0 (get count (map-get? review-counts { report-id: report-id })))) }
    )
    (ok true)
  )
)

(define-read-only (get-review (report-id uint) (reviewer principal))
  (ok (map-get? reviews { report-id: report-id, reviewer: reviewer }))
)

(define-read-only (get-review-count (report-id uint))
  (ok (default-to u0 (get count (map-get? review-counts { report-id: report-id }))))
)

(define-read-only (is-report-validated (report-id uint))
  (>= (unwrap! (get-review-count report-id) false) min-reviews)
)

