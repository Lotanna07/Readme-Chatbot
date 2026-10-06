import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://fyrisacjvolzvkdwzfap.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5cmlzYWNqdm9senZrZHd6ZmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExOTcxMjEsImV4cCI6MjEwNjc3MzEyMX0.S_ygztB9Fj6JTj1IShteGJkWNlZF_pbgtWQKcULZ1KU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)