import { describe, expect, it } from 'vitest'
import { cn, getViteEnvVar } from '../utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    it('should handle conditional classes', () => {
      const condition = true
      const result = cn('base-class', condition && 'conditional-class')

      expect(result).toContain('base-class')
      expect(result).toContain('conditional-class')
    })

    it('should ignore falsy values', () => {
      const result = cn('valid', null, undefined, false, '', 'also-valid')

      expect(result).toContain('valid')
      expect(result).toContain('also-valid')
      expect(result).not.toContain('null')
      expect(result).not.toContain('undefined')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')

      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    it('should handle object syntax for conditional classes', () => {
      const result = cn({
        'always-true': true,
        'always-false': false,
        'sometimes-true': 1 > 0,
      })

      expect(result).toContain('always-true')
      expect(result).toContain('sometimes-true')
      expect(result).not.toContain('always-false')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle string with spaces properly', () => {
      const result = cn('class1 class2', 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })
  })

  describe('getViteEnvVar', () => {
    it('should be a function that returns string', () => {
      expect(typeof getViteEnvVar).toBe('function')

      const result = getViteEnvVar('NONEXISTENT_VAR', 'default_value')
      expect(typeof result).toBe('string')
      expect(result).toBe('default_value')
    })

    it('should handle default values properly', () => {
      const result1 = getViteEnvVar('DEFINITELY_NOT_SET', 'my_default')
      const result2 = getViteEnvVar('ALSO_NOT_SET', '')
      const result3 = getViteEnvVar('ANOTHER_NOT_SET', 'another_default')

      expect(result1).toBe('my_default')
      expect(result2).toBe('')
      expect(result3).toBe('another_default')
    })

    it('should handle options parameter without throwing', () => {
      // Test that the function accepts options without errors
      expect(() => {
        getViteEnvVar('TEST_VAR', 'default', { logWarning: false })
      }).not.toThrow()

      expect(() => {
        getViteEnvVar('TEST_VAR', 'default', { logPrefix: 'Custom' })
      }).not.toThrow()

      expect(() => {
        getViteEnvVar('TEST_VAR', 'default', {
          logWarning: true,
          logPrefix: 'Test',
        })
      }).not.toThrow()
    })

    it('should handle undefined options gracefully', () => {
      expect(() => {
        getViteEnvVar('TEST_VAR', 'default', undefined)
      }).not.toThrow()
    })

    it('should handle empty options object', () => {
      expect(() => {
        getViteEnvVar('TEST_VAR', 'default', {})
      }).not.toThrow()
    })
  })
})
