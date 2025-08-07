# ResetPasswordPage Component

A comprehensive password reset implementation for React applications using Supabase authentication. This component handles the complete password reset flow from email links to password update completion.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Component Structure](#component-structure)
- [Configuration](#configuration)
- [Styling](#styling)
- [Integration Steps](#integration-steps)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)

## 🎯 Overview

The `ResetPasswordPage` component provides a secure and user-friendly way to handle password resets in your application. It's designed to work seamlessly with Supabase authentication and includes proper error handling, loading states, and responsive design.

### Key Benefits
- ✅ Secure password reset flow
- ✅ Automatic authentication state management
- ✅ Responsive design matching your app's theme
- ✅ Built-in validation and error handling
- ✅ Toast notifications for user feedback
- ✅ Proper logout handling after password change

## 🚀 Features

- **Email Link Handling**: Automatically processes password reset links from emails
- **Form Validation**: Confirms password matching and strength requirements
- **Loading States**: Visual feedback during authentication and password update
- **Error Handling**: Graceful handling of invalid links and authentication errors
- **Responsive Design**: Mobile-first design that works on all devices
- **Theme Consistency**: Matches your application's visual design system
- **Security**: Proper logout after password change for security

## 📋 Prerequisites

Before implementing this component, ensure you have:

1. **React Application** (v16.8+ with hooks support)
2. **Supabase Project** with authentication enabled
3. **React Router** for navigation
4. **Toast Notifications** (react-toastify recommended)
5. **Required Dependencies**:
   ```json
   {
     "react": "^18.0.0",
     "react-router-dom": "^6.0.0",
     "react-toastify": "^9.0.0",
     "@supabase/supabase-js": "^2.0.0"
   }
   ```

## 🛠 Installation & Setup

### 1. Copy Required Files

Copy these files to your project:
```
src/components/auth/
├── ResetPasswordPage.tsx      # Main component
├── AuthContext.tsx           # Authentication context
├── AuthButton.tsx           # Styled button component
└── InputField.tsx          # Styled input component
```

### 2. Install Dependencies

```bash
npm install react-router-dom react-toastify @supabase/supabase-js
```

### 3. Supabase Configuration

Ensure your Supabase project has:
- **Authentication enabled**
- **Email templates configured** for password reset
- **Site URL configured** in authentication settings

Example Supabase setup:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 📖 Usage

### Basic Implementation

1. **Add Route Configuration**:
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPasswordPage from './components/auth/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Other routes */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

2. **Wrap with Authentication Context**:
```tsx
// App.tsx or main.tsx
import { AuthProvider } from './components/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app content */}
    </AuthProvider>
  );
}
```

3. **Add Toast Container**:
```tsx
// App.tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ToastContainer position="top-right" />
    </div>
  );
}
```

## 🏗 Component Structure

```
ResetPasswordPage/
├── Authentication State Checks
│   ├── Loading State (Link Verification)
│   ├── Error State (Invalid/Expired Link)
│   └── Success State (Password Reset Form)
├── Form Components
│   ├── Password Input Field
│   ├── Confirm Password Field
│   └── Submit Button
├── Navigation
│   └── Back to Login Link
└── Styling
    ├── Background & Layout
    ├── Container Styling
    └── Responsive Design
```

## ⚙️ Configuration

### Authentication Context Requirements

Your `AuthContext` must provide:
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  updatePassword: (newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### Required Props

The component doesn't require props but depends on:
- React Router for navigation (`useNavigate`)
- Authentication context (`useAuth`)
- Toast notifications for feedback

### Environment Variables

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎨 Styling

### Default Theme Configuration

The component uses these CSS classes for styling:
- `bg-yelloww` - Main background color
- `bg-gradient-to-b from-yellow-200/85 to-yellow-300` - Container gradient
- `rounded-[2rem]` - Container border radius
- `border-4 border-yellow-200` - Container border

### Customization Options

1. **Color Scheme**: Modify the gradient and background colors
2. **Typography**: Adjust font sizes and weights
3. **Spacing**: Customize padding and margins
4. **Responsive Breakpoints**: Modify mobile/desktop layouts

### Example Customization:
```css
/* Custom theme for your game */
.reset-container {
  background: linear-gradient(to bottom, #your-color-1, #your-color-2);
  border: 4px solid #your-border-color;
}
```

## 🔧 Integration Steps

### Step 1: Set Up Supabase Authentication

1. Configure password reset email template in Supabase dashboard
2. Set redirect URL to: `https://yourdomain.com/#/reset-password`
3. Enable email authentication in your Supabase project

### Step 2: Create Required Components

```typescript
// InputField.tsx - Example implementation
interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ ... }) => {
  // Your input field implementation
};
```

### Step 3: Configure Routing

Ensure your routing prioritizes the reset password route:
```tsx
<Routes>
  <Route path="/reset-password" element={<ResetPasswordPage />} />
  <Route path="/" element={<AuthPage />} />
  {/* Other routes */}
</Routes>
```

### Step 4: Add Password Reset Trigger

In your login form, add a "Forgot Password?" link:
```tsx
const handleForgotPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#/reset-password`,
  });
  
  if (error) {
    toast.error(error.message);
  } else {
    toast.success('Password reset email sent!');
  }
};
```

## 🐛 Troubleshooting

### Common Issues

1. **404 Error on Reset Links**
   - Ensure route is properly configured
   - Check redirect URL in Supabase settings
   - Verify hash routing is enabled

2. **Authentication State Issues**
   - Confirm AuthContext is properly wrapped
   - Check Supabase session handling
   - Verify token parsing from URL

3. **Styling Inconsistencies**
   - Ensure CSS classes are available
   - Check Tailwind CSS configuration
   - Verify responsive breakpoints

4. **Email Not Sending**
   - Check Supabase email settings
   - Verify SMTP configuration
   - Test with different email providers

### Debug Mode

Enable debug logging:
```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development';

if (DEBUG_MODE) {
  console.log('Reset password state:', { user, isAuthenticated, loading });
}
```

## 📚 API Reference

### AuthContext Methods

```typescript
// Update user password
updatePassword(newPassword: string): Promise<void>

// Sign out current user
signOut(): Promise<void>

// Reset password via email
resetPasswordForEmail(email: string, options?: object): Promise<void>
```

### Component Props

```typescript
interface ResetPasswordPageProps {
  // No direct props - uses context and routing
}
```

### Supabase Auth Methods

```typescript
// Get current session
supabase.auth.getSession()

// Update user password
supabase.auth.updateUser({ password: newPassword })

// Sign out user
supabase.auth.signOut()
```

## 🔒 Security Considerations

1. **Token Validation**: Always validate reset tokens server-side
2. **Rate Limiting**: Implement rate limiting for password reset requests
3. **Password Strength**: Enforce strong password requirements
4. **Session Management**: Properly handle session cleanup after password change
5. **HTTPS**: Always use HTTPS in production
6. **Email Security**: Use secure email templates and links

## 🌟 Best Practices

1. **User Experience**:
   - Provide clear feedback at each step
   - Use loading states for better UX
   - Handle errors gracefully

2. **Security**:
   - Log out users after password change
   - Validate passwords on both client and server
   - Use secure redirect URLs

3. **Accessibility**:
   - Proper form labels and ARIA attributes
   - Keyboard navigation support
   - Screen reader compatibility

4. **Performance**:
   - Lazy load the component if not immediately needed
   - Optimize image assets
   - Use proper caching strategies

## 📝 License

This component is part of the FSQM project and follows the same license terms.

## 🤝 Contributing

When adapting this component for other games:

1. **Maintain Security**: Don't compromise on security features
2. **Preserve Functionality**: Keep core password reset logic intact
3. **Customize Styling**: Adapt visual design to match your game's theme
4. **Test Thoroughly**: Ensure all states and edge cases work properly
5. **Document Changes**: Update this README with your modifications

## 📞 Support

For implementation help or issues:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Test with different email providers
4. Verify routing configuration

---

**Happy Coding! 🚀**

*This component provides a solid foundation for password reset functionality that can be easily adapted to any React application or game.*
