'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

// Example API call function
async function submitUserData(_data: z.infer<typeof FormSchema>) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simulate random success/failure for demo
  if (Math.random() > 0.7) {
    throw new Error('Simulated server error')
  }

  return { success: true, id: Math.random().toString(36) }
}

export function ExampleForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })

  // React Query mutation for server calls
  const submitMutation = useMutation({
    mutationFn: submitUserData,
    onSuccess: result => {
      toast.success('Form submitted successfully!', {
        description: `User ID: ${result.id}`,
      })
      form.reset()
    },
    onError: error => {
      toast.error('Submission failed', {
        description: error.message,
      })
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    submitMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" type="email" {...field} />
              </FormControl>
              <FormDescription>We'll use this to contact you.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitMutation.isPending} className="w-full">
          {submitMutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
