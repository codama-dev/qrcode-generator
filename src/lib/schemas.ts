import { z } from 'zod'
import { UserRole } from './types'

// Joke API Schemas
export const jokeSchema = z.object({
  type: z.string(),
  setup: z.string(),
  punchline: z.string(),
  id: z.number(),
})

export const jokeArraySchema = z.array(jokeSchema)
export const singleJokeSchema = jokeSchema

// Joke categories enum
export enum JokeCategory {
  GENERAL = 'general',
  PROGRAMMING = 'programming',
  DAD = 'dad',
  KNOCK_KNOCK = 'knock-knock',
}

// API Response schemas (used by api.ts)
export const genericEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  responseObject: z.unknown().optional(),
  statusCode: z.number().optional(),
})

export const serviceResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema,
    statusCode: z.number(),
  })

export const apiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.nullable(),
    statusCode: z.number(),
  })

// User Profile Form Schema
export const userProfileFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z
    .string({
      required_error: 'Please enter an email address.',
    })
    .email({
      message: 'Please enter a valid email address.',
    }),
  dateOfBirth: z.date({
    required_error: 'A date of birth is required.',
  }),
  role: z.nativeEnum(UserRole, {
    required_error: 'Please select a role.',
    invalid_type_error: 'Please select a valid role.',
  }),
  language: z.string({
    required_error: 'Please select a language.',
  }),
  bio: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 160 characters.',
    }),
})
