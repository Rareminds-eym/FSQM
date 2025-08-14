// Utility to reset PWA install state for testing
export const resetPWAInstallState = () => {
  localStorage.removeItem('pwa-install-dismissed');
  sessionStorage.removeItem('pwa-floating-dismissed');
  console.log('PWA install state reset');
};

// Add to window for easy access in dev tools
if (typeof window !== 'undefined') {
  (window as any).resetPWAInstallState = resetPWAInstallState;
}