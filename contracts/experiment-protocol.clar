;; Experiment Protocol Contract

(define-map experiments
  { experiment-id: uint }
  {
    creator: principal,
    title: (string-ascii 100),
    description: (string-utf8 1000),
    reward-amount: uint,
    start-block: uint,
    end-block: uint
  }
)

(define-map experiment-participants
  { experiment-id: uint, participant: principal }
  { joined: bool }
)

(define-data-var last-experiment-id uint u0)

(define-fungible-token dream-token)

(define-public (create-experiment (title (string-ascii 100)) (description (string-utf8 1000)) (reward-amount uint) (duration uint))
  (let
    (
      (new-id (+ (var-get last-experiment-id) u1))
      (start-block block-height)
      (end-block (+ block-height duration))
    )
    (try! (ft-transfer? dream-token reward-amount tx-sender (as-contract tx-sender)))
    (map-set experiments
      { experiment-id: new-id }
      {
        creator: tx-sender,
        title: title,
        description: description,
        reward-amount: reward-amount,
        start-block: start-block,
        end-block: end-block
      }
    )
    (var-set last-experiment-id new-id)
    (ok new-id)
  )
)

(define-public (join-experiment (experiment-id uint))
  (let
    (
      (experiment (unwrap! (map-get? experiments { experiment-id: experiment-id }) (err u404)))
    )
    (asserts! (<= block-height (get end-block experiment)) (err u403))
    (ok (map-set experiment-participants
      { experiment-id: experiment-id, participant: tx-sender }
      { joined: true }
    ))
  )
)

(define-public (distribute-reward (experiment-id uint) (participant principal))
  (let
    (
      (experiment (unwrap! (map-get? experiments { experiment-id: experiment-id }) (err u404)))
      (has-joined (default-to false (get joined (map-get? experiment-participants { experiment-id: experiment-id, participant: participant }))))
    )
    (asserts! (is-eq tx-sender (get creator experiment)) (err u403))
    (asserts! (> block-height (get end-block experiment)) (err u403))
    (asserts! has-joined (err u404))
    (as-contract (ft-transfer? dream-token (get reward-amount experiment) tx-sender participant))
  )
)

(define-read-only (get-experiment (experiment-id uint))
  (ok (map-get? experiments { experiment-id: experiment-id }))
)

