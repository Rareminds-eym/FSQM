# Team Registration System

This document explains the team registration system that checks if a user exists in the `teams` table and provides a form for team creation/joining when the user is not found.

## Overview

The system automatically checks if a user has a `user_id` in the `teams` table. If not found, it displays a form with the following fields:
- Email
- Phone
- Full Name
- Team Name (for team leaders)
- College Code (for team leaders)
- Team Leader Status (Yes/No buttons)
- Join Code (for team members)

## Components

### 1. TeamRegistrationForm.tsx
The main form component that handles team creation and joining.

**Features:**
- Automatically checks if user exists in teams table
- Shows different fields based on team leader status
- Validates join codes for team members
- Generates unique join codes for team leaders
- Handles form submission and database operations

### 2. TeamRegistrationModal.tsx
A modal wrapper for the registration form.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `canClose?: boolean` - Whether the modal can be closed (default: true)

### 3. TeamRegistrationGuard.tsx
A guard component that protects routes requiring team registration.

**Props:**
- `children: React.ReactNode` - Components to render if registration is complete
- `redirectTo?: string` - Route to redirect to if registration needed (default: '/team-registration')
- `showInlineForm?: boolean` - Show form inline instead of redirecting (default: false)

### 4. TeamRegistrationWrapper.tsx
A wrapper that optionally shows registration modal when needed.

**Props:**
- `children: React.ReactNode` - Components to wrap
- `requireTeamRegistration?: boolean` - Whether registration is required (default: true)
- `showModalOnMissingRegistration?: boolean` - Show modal automatically (default: true)

## Hooks

### useTeamRegistrationCheck.ts
A custom hook that checks team registration status.

**Returns:**
```typescript
{
  isLoading: boolean;
  needsRegistration: boolean;
  hasTeam: boolean;
  error: string | null;
}
```

## Utilities

### teamRegistrationUtils.ts
Utility functions for checking team registration status.

**Functions:**
- `checkUserExistsInTeamsTable(userId: string): Promise<boolean>`
- `checkTeamRegistrationStatus(userId: string): Promise<{exists, isComplete, missingFields}>`

## Usage Examples

### 1. Basic Usage - Standalone Page
```tsx
import TeamRegistration from './pages/TeamRegistration';

// Add to your routing
<Route path="/team-registration" element={<TeamRegistration />} />
```

### 2. Modal Usage
```tsx
import { useState } from 'react';
import TeamRegistrationModal from './components/ui/TeamRegistrationModal';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Complete Registration
      </button>
      <TeamRegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
```

### 3. Route Protection
```tsx
import TeamRegistrationGuard from './components/ui/TeamRegistrationGuard';

// Protect a route
<Route path="/protected" element={
  <TeamRegistrationGuard>
    <ProtectedComponent />
  </TeamRegistrationGuard>
} />

// Or show inline form
<Route path="/protected" element={
  <TeamRegistrationGuard showInlineForm={true}>
    <ProtectedComponent />
  </TeamRegistrationGuard>
} />
```

### 4. Wrapper Usage
```tsx
import TeamRegistrationWrapper from './components/ui/TeamRegistrationWrapper';

const App = () => {
  return (
    <TeamRegistrationWrapper>
      <YourAppContent />
    </TeamRegistrationWrapper>
  );
};
```

### 5. Hook Usage
```tsx
import { useTeamRegistrationCheck } from './hooks/useTeamRegistrationCheck';

const MyComponent = () => {
  const { isLoading, needsRegistration, hasTeam, error } = useTeamRegistrationCheck();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (needsRegistration) return <div>Please complete registration</div>;

  return <div>Welcome! You have a team.</div>;
};
```

## Database Schema

The system works with the existing `teams` table:

```sql
create table public.teams (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  email text not null,
  phone text not null,
  full_name text not null,
  team_name text not null,
  college_code text not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  is_team_leader boolean null,
  session_id text null,
  join_code character varying(6) null,
  constraint teams_pkey primary key (id),
  constraint teams_session_id_email_key unique (session_id, email),
  constraint teams_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
);
```

## Form Flow

### For Team Leaders:
1. User selects "Yes" for team leader
2. Form shows: Email, Phone, Full Name, Team Name, College Code
3. On submission, generates unique 6-character join code
4. Creates new team record with generated session_id

### For Team Members:
1. User selects "No" for team leader
2. Form shows: Email, Phone, Full Name, Join Code
3. Join code lookup auto-fills Team Name and College Code
4. On submission, joins existing team using the same session_id

## Validation

- Email: Required, valid email format
- Phone: Required, exactly 10 digits
- Full Name: Required, non-empty string
- Team Name: Required for team leaders
- College Code: Required for team leaders, dropdown with predefined options
- Join Code: Required for team members, must be valid 6-character code

## Error Handling

The system handles various error scenarios:
- Database connection issues
- Duplicate team entries
- Invalid join codes
- Permission errors
- Network connectivity issues

## Integration with Existing App

The team registration system is already integrated into the main App.tsx:

```tsx
// Added team registration route
{isAuthenticated && (
  <Route path="/team-registration" element={<TeamRegistration />} />
)}
```

## Customization

You can customize the system by:
1. Modifying the form fields in `TeamRegistrationForm.tsx`
2. Changing validation rules
3. Customizing the UI/styling
4. Adding additional team member limits
5. Modifying the join code generation logic

## Testing

To test the system:
1. Create a user account
2. Check that the form appears when user_id is not in teams table
3. Test both team leader and team member flows
4. Verify join code generation and lookup
5. Test form validation and error handling

## Security Considerations

- All database operations use Row Level Security (RLS)
- User authentication is verified before any operations
- Join codes are generated using secure random characters
- Input validation prevents SQL injection and XSS attacks
- Phone numbers are validated for format and length