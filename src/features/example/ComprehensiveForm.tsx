'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { userProfileFormSchema } from '@/lib/schemas'
import { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

// Use the centralized schema
type FormSchema = z.infer<typeof userProfileFormSchema>

// Example API call function
async function submitUserData(_data: FormSchema) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  // In a real app, you'd send this data to your API endpoint
  // For demo purposes, we're just simulating the API call

  // Simulate random success/failure for demo
  if (Math.random() > 0.8) {
    throw new Error('Simulated server error')
  }

  return { success: true, id: Math.random().toString(36) }
}

export function ComprehensiveForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      username: '',
      email: '',
      bio: '',
    },
  })

  // React Query mutation for server calls
  const submitMutation = useMutation({
    mutationFn: submitUserData,
    onSuccess: result => {
      toast.success('Form submitted successfully!', {
        description: `User profile created with ID: ${result.id}`,
      })
      form.reset()
    },
    onError: error => {
      toast.error('Submission failed', {
        description: error.message,
      })
    },
  })

  function onSubmit(data: FormSchema) {
    submitMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormDescription>We'll use this to send you important updates.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth Field */}
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date > new Date() || date < new Date('1900-01-01')}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Select Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserRole.DEVELOPER}>Developer</SelectItem>
                  <SelectItem value={UserRole.DESIGNER}>Designer</SelectItem>
                  <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                  <SelectItem value={UserRole.ANALYST}>Analyst</SelectItem>
                  <SelectItem value={UserRole.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the role that best describes your position.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language Combobox Field */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? languages.find(language => language.value === field.value)?.label
                        : 'Select language'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map(language => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
                            }}
                          >
                            {language.label}
                            <Check
                              className={cn(
                                'ml-auto',
                                language.value === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio Textarea Field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitMutation.isPending} className="w-full">
          {submitMutation.isPending ? 'Submitting...' : 'Submit Profile'}
        </Button>
      </form>
    </Form>
  )
}
