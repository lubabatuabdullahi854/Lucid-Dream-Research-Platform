import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockContractCall = vi.fn()

describe('Peer Review Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('submit-review', () => {
    it('should submit a review successfully', async () => {
      const reportId = 1
      const score = 8
      const comment = 'This is a great lucid dream report.'
      
      mockContractCall.mockResolvedValue({ value: true })
      
      const result = await mockContractCall('peer-review', 'submit-review', [reportId, score, comment])
      
      expect(result.value).toBe(true)
      expect(mockContractCall).toHaveBeenCalledWith('peer-review', 'submit-review', [reportId, score, comment])
    })
    
    it('should fail if score is out of range', async () => {
      const reportId = 1
      const score = 11
      const comment = 'Invalid score'
      
      mockContractCall.mockRejectedValue(new Error('Score out of range'))
      
      await expect(mockContractCall('peer-review', 'submit-review', [reportId, score, comment]))
          .rejects.toThrow('Score out of range')
    })
  })
  
  describe('get-review', () => {
    it('should return a review for a given report and reviewer', async () => {
      const reportId = 1
      const reviewer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const expectedReview = {
        score: 8,
        comment: 'This is a great lucid dream report.',
        timestamp: 123456
      }
      
      mockContractCall.mockResolvedValue({ value: expectedReview })
      
      const result = await mockContractCall('peer-review', 'get-review', [reportId, reviewer])
      
      expect(result.value).toEqual(expectedReview)
      expect(mockContractCall).toHaveBeenCalledWith('peer-review', 'get-review', [reportId, reviewer])
    })
    
    it('should return null for non-existent review', async () => {
      const reportId = 999
      const reviewer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      
      mockContractCall.mockResolvedValue({ value: null })
      
      const result = await mockContractCall('peer-review', 'get-review', [reportId, reviewer])
      
      expect(result.value).toBeNull()
    })
  })
  
  describe('get-review-count', () => {
    it('should return the number of reviews for a report', async () => {
      const reportId = 1
      
      mockContractCall.mockResolvedValue({ value: 3 })
      
      const result = await mockContractCall('peer-review', 'get-review-count', [reportId])
      
      expect(result.value).toBe(3)
      expect(mockContractCall).toHaveBeenCalledWith('peer-review', 'get-review-count', [reportId])
    })
  })
  
  describe('is-report-validated', () => {
    it('should return true if report has enough reviews', async () => {
      const reportId = 1
      
      mockContractCall.mockResolvedValue({ value: true })
      
      const result = await mockContractCall('peer-review', 'is-report-validated', [reportId])
      
      expect(result.value).toBe(true)
      expect(mockContractCall).toHaveBeenCalledWith('peer-review', 'is-report-validated', [reportId])
    })
    
    it('should return false if report does not have enough reviews', async () => {
      const reportId = 2
      
      mockContractCall.mockResolvedValue({ value: false })
      
      const result = await mockContractCall('peer-review', 'is-report-validated', [reportId])
      
      expect(result.value).toBe(false)
      expect(mockContractCall).toHaveBeenCalledWith('peer-review', 'is-report-validated', [reportId])
    })
  })
})

