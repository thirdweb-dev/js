# Support Feedback Feature

## Overview

Added a feedback collection system to support tickets that allows users to rate their experience and provide optional comments when tickets are closed.

## Features

- **Star Rating System**: 1-5 star rating with visual feedback
- **Text Feedback**: Optional text input for detailed comments
- **Automatic Display**: Feedback form appears when support tickets are closed
- **Data Storage**: Feedback is stored in Supabase database
- **Success Feedback**: Toast notifications and form reset after submission

## Implementation

### Database

- **Table**: `support_feedback`
- **Columns**:
  - `id` (UUID, Primary Key)
  - `created_at` (Timestamp, auto-generated)
  - `rating` (Integer, 1-5)
  - `feedback` (Text, optional)

### Files Added/Modified

- `src/@/lib/supabase.ts` - Supabase client configuration
- `src/app/(app)/team/[team_slug]/(team)/~/support/apis/feedback.ts` - Feedback submission API
- `src/app/(app)/team/[team_slug]/(team)/~/support/_components/SupportCaseDetails.tsx` - Updated with feedback form

### Dependencies

- `@supabase/supabase-js` - Added for database operations

## Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

1. Navigate to a closed support ticket
2. The feedback form will appear at the bottom
3. Rate the experience (1-5 stars)
4. Add optional text feedback
5. Click "Send Feedback"
6. Data is saved to Supabase and form resets

## Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE support_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER NOT NULL,
  feedback TEXT
);
```
