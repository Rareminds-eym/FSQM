# Landscape Mode Feature

## 🎯 **Overview**

The FSQM Simulation game now automatically prompts users to rotate their mobile devices to landscape mode for an optimal gaming experience. This feature enhances gameplay by providing more screen real estate for game elements.

## 🔧 **Implementation Details**

### **Detection Logic**
- **Mobile Detection**: Uses `useDeviceLayout` hook to detect mobile devices
- **Orientation Detection**: Monitors device orientation (portrait vs landscape)
- **Smart Prompting**: Only shows prompt when necessary (mobile + portrait + not dismissed)

### **User Experience Flow**
1. **Game Loads**: System detects device type and orientation
2. **Portrait Detected**: If mobile device is in portrait mode, show rotation prompt
3. **User Choice**: User can either rotate device or continue in portrait
4. **Persistent Setting**: User's choice is remembered for the session

## 🎨 **Visual Design**

### **Modal Features**
- **Animated Icon**: Rotating device icon with smooth animation
- **Clear Messaging**: Explains benefits of landscape mode
- **Two Options**: Rotate device or continue in portrait
- **Responsive Design**: Adapts to different screen sizes

### **Styling**
- **Custom CSS**: Dedicated stylesheet for landscape prompt
- **Animations**: Smooth slide-in and rotation animations
- **Color Scheme**: Orange/red gradient for attention-grabbing design
- **Accessibility**: High contrast and readable text

## 🚀 **Technical Features**

### **Screen Orientation API**
```typescript
// Attempts to lock screen to landscape if supported
if ('screen' in window && 'orientation' in window.screen) {
  await window.screen.orientation.lock('landscape');
}
```

### **Event Listeners**
- **Orientation Change**: Detects when device is rotated
- **Window Resize**: Handles browser resize events
- **Automatic Cleanup**: Removes listeners on component unmount

### **State Management**
```typescript
const [showLandscapePrompt, setShowLandscapePrompt] = useState(false);
const [hasUserDismissedPrompt, setHasUserDismissedPrompt] = useState(false);
```

## 📱 **Device Support**

### **Supported Devices**
- ✅ **iOS Safari**: Full support with orientation detection
- ✅ **Android Chrome**: Full support with orientation detection
- ✅ **Mobile Firefox**: Orientation detection (limited API support)
- ✅ **Samsung Internet**: Full support

### **API Limitations**
- **Screen Orientation Lock**: Limited browser support
- **Fallback Behavior**: Shows prompt when API unavailable
- **User Gesture Required**: Some browsers require user interaction

## 🎮 **User Benefits**

### **Enhanced Gameplay**
- **More Screen Space**: Better visibility of game elements
- **Improved Controls**: Easier interaction with game interface
- **Better Readability**: Text and images are more legible
- **Immersive Experience**: Landscape mode feels more game-like

### **Accessibility**
- **Optional**: Users can choose to continue in portrait
- **Non-Intrusive**: Prompt can be dismissed permanently
- **Clear Instructions**: Simple, easy-to-understand messaging

## 🔧 **Configuration Options**

### **Customization Points**
```typescript
// Show prompt timing
useEffect(() => {
  if (gameState.gameStarted && isMobile && !isHorizontal) {
    setShowLandscapePrompt(true);
  }
}, [gameState.gameStarted, isMobile, isHorizontal]);

// Prompt behavior
const checkOrientation = () => {
  const isMobilePortrait = isMobile && !isHorizontal;
  if (isMobilePortrait && !hasUserDismissedPrompt) {
    setShowLandscapePrompt(true);
  }
};
```

### **CSS Customization**
- **Animation Duration**: Modify rotation and slide animations
- **Colors**: Change gradient and text colors
- **Timing**: Adjust prompt display timing
- **Responsive Breakpoints**: Customize mobile detection

## 📊 **Performance Impact**

### **Minimal Overhead**
- **Event Listeners**: Only 2 lightweight listeners
- **State Updates**: Minimal re-renders
- **CSS Animations**: Hardware-accelerated transforms
- **Memory Usage**: Negligible impact

### **Optimization Features**
- **Conditional Rendering**: Prompt only shows when needed
- **Event Cleanup**: Proper listener removal
- **Debounced Checks**: Prevents excessive orientation checks

## 🧪 **Testing Scenarios**

### **Test Cases**
1. **Mobile Portrait**: Should show landscape prompt
2. **Mobile Landscape**: Should not show prompt
3. **Desktop**: Should never show prompt
4. **Orientation Change**: Should respond to device rotation
5. **User Dismissal**: Should remember user choice
6. **Game Start**: Should show prompt when game begins

### **Browser Testing**
- Test on iOS Safari, Chrome, Firefox
- Test on Android Chrome, Samsung Internet
- Verify orientation detection accuracy
- Check animation smoothness

## 🔮 **Future Enhancements**

### **Potential Improvements**
- **Vibration Feedback**: Haptic feedback on supported devices
- **Progressive Web App**: Better orientation control in PWA mode
- **Analytics**: Track rotation prompt effectiveness
- **A/B Testing**: Test different prompt designs

### **Advanced Features**
- **Auto-Rotation**: Attempt automatic rotation where supported
- **Orientation Lock**: Lock orientation during gameplay
- **Gesture Hints**: Show swipe gestures for rotation
- **Device-Specific**: Customize prompts per device type

## 📝 **Implementation Notes**

### **Files Modified**
- `GmpSimulation.tsx`: Main component logic
- `landscape-prompt.css`: Styling and animations
- `landscape-mode.md`: This documentation

### **Dependencies**
- `useDeviceLayout`: Existing orientation detection hook
- `lucide-react`: RotateCcw icon component
- React hooks: useState, useEffect, useCallback

### **Browser Compatibility**
- **Modern Browsers**: Full feature support
- **Legacy Browsers**: Graceful degradation
- **No JavaScript**: Game still playable without prompt
