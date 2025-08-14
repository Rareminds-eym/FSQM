# PWA Setup Guide for FSQM

## Overview
Your FSQM application now has full Progressive Web App (PWA) capabilities, allowing users to install it on their devices and use it offline.

## Features Added

### 1. Service Worker & Caching
- Automatic caching of app resources
- Runtime caching for fonts and external resources
- Offline functionality with fallback pages

### 2. App Manifest
- Installable app with custom icons
- Standalone display mode
- Theme colors and branding

### 3. Update Management
- Automatic update detection
- User-friendly update prompts
- Background updates with user consent

### 4. Install Prompts
- Native install prompts for supported browsers
- Custom install UI for better UX
- iOS-specific installation instructions

## Components Added

### PWAUpdatePrompt
- Shows when app updates are available
- Allows users to update immediately or later
- Displays offline-ready notifications

### PWAInstallPrompt
- Appears when app can be installed
- Handles the browser's install prompt
- Dismissible by user

### PWAStatus (Optional)
- Shows current PWA status
- Connection status indicator
- Installation and display mode info
- Can be added to settings page

## Testing Your PWA

### Development Testing
```bash
# Run development server
npm run dev

# Build and preview (recommended for PWA testing)
npm run build:pwa
```

### Production Testing
```bash
# Build for production
npm run build

# Preview with HTTPS (required for PWA features)
npm run preview:https
```

### Browser Testing Checklist

#### Chrome/Edge DevTools
1. Open DevTools → Application tab
2. Check "Service Workers" section
3. Verify "Manifest" section shows correct data
4. Test "Add to homescreen" functionality
5. Use "Offline" checkbox to test offline functionality

#### Lighthouse PWA Audit
1. Open DevTools → Lighthouse tab
2. Select "Progressive Web App" category
3. Run audit and fix any issues
4. Aim for 90+ PWA score

### Mobile Testing
1. Deploy to a HTTPS server
2. Open in mobile browser
3. Test install prompt
4. Verify offline functionality
5. Check app icon and splash screen

## File Structure
```
public/
├── pwa-192x192.png      # PWA icon 192x192
├── pwa-512x512.png      # PWA icon 512x512
├── apple-touch-icon.png # iOS icon
└── masked-icon.svg      # Safari pinned tab icon

src/
├── components/
│   ├── PWAUpdatePrompt.tsx  # Update notifications
│   ├── PWAInstallPrompt.tsx # Install prompts
│   └── PWAStatus.tsx        # Status component
└── utils/
    └── pwa.ts              # PWA utility functions
```

## Configuration

### Vite PWA Plugin Settings
The PWA is configured in `vite.config.ts` with:
- Auto-update registration
- Comprehensive caching strategies
- Custom manifest settings
- Workbox runtime caching

### Customization Options
You can modify the PWA behavior by editing:
- `vite.config.ts` - Main PWA configuration
- `index.html` - Meta tags and theme colors
- Icon files in `public/` directory

## Deployment Notes

### HTTPS Requirement
PWAs require HTTPS in production. Make sure your hosting supports SSL.

### Icon Requirements
- Ensure icons are properly sized (192x192, 512x512)
- Use high-quality images for better user experience
- Consider creating custom icons instead of using the bulb.png

### Browser Support
- Chrome/Edge: Full support
- Firefox: Good support
- Safari: Limited support (no install prompt)
- iOS Safari: Manual installation only

## Troubleshooting

### Service Worker Issues
- Clear browser cache and storage
- Check browser console for errors
- Verify HTTPS is working

### Install Prompt Not Showing
- Ensure HTTPS is enabled
- Check PWA criteria in DevTools
- Test on different browsers

### Offline Functionality
- Verify service worker is registered
- Check cache storage in DevTools
- Test with network disabled

## Next Steps

1. **Custom Icons**: Replace the default bulb icons with custom PWA icons
2. **Push Notifications**: Add push notification support if needed
3. **Background Sync**: Implement background sync for data updates
4. **App Shortcuts**: Add app shortcuts in the manifest
5. **Share Target**: Enable the app to receive shared content

Your FSQM app is now a fully functional PWA! Users can install it on their devices and use it offline.