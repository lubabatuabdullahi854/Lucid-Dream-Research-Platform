import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockContractCall = vi.fn()

describe('Dream Data Storage Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('submit-dream-report', () => {
    it('should submit a dream report successfully', async () => {
      const encryptedReport = new Uint8Array(1024).fill(1)
      const encryptedBiometrics = new Uint8Array(512).fill(2)
      
      mockContractCall.mockResolvedValue({ value: 1 })
      
      const result = await mockContractCall('dream-data-storage', 'submit-dream-report', [
        encryptedReport,
        encryptedBiometrics
      ])
      
      expect(result.value).toBe(1)
      expect(mockContractCall).toHaveBeenCalledWith('dream-data-storage', 'submit-dream-report', [
        encryptedReport,
        encryptedBiometrics
      ])
    })
  })
  
  describe('get-dream-report', () => {
    it('should return a dream report for a given ID', async () => {
      const reportId = 1
      const expectedReport = {
        dreamer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        encrypted_report: new Uint8Array(1024).fill(1),
        encrypted_biometrics: new Uint8Array(512).fill(2),
        timestamp: 123456
      }
      
      mockContractCall.mockResolvedValue({ value: expectedReport })
      
      const result = await mockContractCall('dream-data-storage', 'get-dream-report', [reportId])
      
      expect(result.value).toEqual(expectedReport)
      expect(mockContractCall).toHaveBeenCalledWith('dream-data-storage', 'get-dream-report', [reportId])
    })
    
    it('should return null for non-existent report', async () => {
      const reportId = 999
      
      mockContractCall.mockResolvedValue({ value: null })
      
      const result = await mockContractCall('dream-data-storage', 'get-dream-report', [reportId])
      
      expect(result.value).toBeNull()
    })
  })
  
  describe('get-last-report-id', () => {
    it('should return the last report ID', async () => {
      mockContractCall.mockResolvedValue({ value: 5 })
      
      const result = await mockContractCall('dream-data-storage', 'get-last-report-id', [])
      
      expect(result.value).toBe(5)
      expect(mockContractCall).toHaveBeenCalledWith('dream-data-storage', 'get-last-report-id', [])
    })
  })
})

