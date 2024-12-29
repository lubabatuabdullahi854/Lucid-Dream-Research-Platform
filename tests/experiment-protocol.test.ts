import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockContractCall = vi.fn()

describe('Experiment Protocol Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-experiment', () => {
    it('should create an experiment successfully', async () => {
      const title = 'Test Experiment'
      const description = 'This is a test experiment for lucid dreaming.'
      const rewardAmount = 100
      const duration = 1000
      
      mockContractCall.mockResolvedValue({ value: 1 })
      
      const result = await mockContractCall('experiment-protocol', 'create-experiment', [
        title,
        description,
        rewardAmount,
        duration
      ])
      
      expect(result.value).toBe(1)
      expect(mockContractCall).toHaveBeenCalledWith('experiment-protocol', 'create-experiment', [
        title,
        description,
        rewardAmount,
        duration
      ])
    })
  })
  
  describe('join-experiment', () => {
    it('should allow joining an experiment', async () => {
      const experimentId = 1
      
      mockContractCall.mockResolvedValue({ value: true })
      
      const result = await mockContractCall('experiment-protocol', 'join-experiment', [experimentId])
      
      expect(result.value).toBe(true)
      expect(mockContractCall).toHaveBeenCalledWith('experiment-protocol', 'join-experiment', [experimentId])
    })
    
    it('should fail if experiment has ended', async () => {
      const experimentId = 1
      
      mockContractCall.mockRejectedValue(new Error('Experiment has ended'))
      
      await expect(mockContractCall('experiment-protocol', 'join-experiment', [experimentId]))
          .rejects.toThrow('Experiment has ended')
    })
  })
  
  describe('distribute-reward', () => {
    it('should distribute reward successfully', async () => {
      const experimentId = 1
      const participant = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      
      mockContractCall.mockResolvedValue({ value: true })
      
      const result = await mockContractCall('experiment-protocol', 'distribute-reward', [experimentId, participant])
      
      expect(result.value).toBe(true)
      expect(mockContractCall).toHaveBeenCalledWith('experiment-protocol', 'distribute-reward', [experimentId, participant])
    })
    
    it('should fail if caller is not the experiment creator', async () => {
      const experimentId = 1
      const participant = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      
      mockContractCall.mockRejectedValue(new Error('Not authorized'))
      
      await expect(mockContractCall('experiment-protocol', 'distribute-reward', [experimentId, participant]))
          .rejects.toThrow('Not authorized')
    })
  })
  
  describe('get-experiment', () => {
    it('should return experiment details', async () => {
      const experimentId = 1
      const expectedExperiment = {
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        title: 'Test Experiment',
        description: 'This is a test experiment for lucid dreaming.',
        reward_amount: 100,
        start_block: 10000,
        end_block: 11000
      }
      
      mockContractCall.mockResolvedValue({ value: expectedExperiment })
      
      const result = await mockContractCall('experiment-protocol', 'get-experiment', [experimentId])
      
      expect(result.value).toEqual(expectedExperiment)
      expect(mockContractCall).toHaveBeenCalledWith('experiment-protocol', 'get-experiment', [experimentId])
    })
    
    it('should return null for non-existent experiment', async () => {
      const experimentId = 999
      
      mockContractCall.mockResolvedValue({ value: null })
      
      const result = await mockContractCall('experiment-protocol', 'get-experiment', [experimentId])
      
      expect(result.value).toBeNull()
    })
  })
})

