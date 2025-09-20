import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  canInstall: boolean;
}

export function usePWA() {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOffline: false,
    isStandalone: false,
    isIOS: false,
    canInstall: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isInStandaloneMode = (window.navigator as any).standalone === true;
      const isStandaloneApp = isStandaloneMode || isInStandaloneMode;
      
      setPWAState(prev => ({
        ...prev,
        isStandalone: isStandaloneApp,
        isInstalled: isStandaloneApp,
      }));
    };

    // Check if running on iOS
    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = (window.navigator as any).standalone === true;
      setPWAState(prev => ({
        ...prev,
        isIOS: isIOSDevice && !isInStandaloneMode,
      }));
    };

    // Check online/offline status
    const checkOnlineStatus = () => {
      setPWAState(prev => ({
        ...prev,
        isOffline: !navigator.onLine,
      }));
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, prompt user to refresh
                  console.log('New content is available, please refresh.');
                }
              });
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      setPWAState(prev => ({
        ...prev,
        isInstallable: true,
        canInstall: true,
      }));
      
      console.log('PWA: Install prompt available');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        canInstall: false,
      }));
      setDeferredPrompt(null);
    };

    // Listen for display mode changes
    const handleDisplayModeChange = () => {
      checkInstalled();
    };

    // Listen for online/offline changes
    const handleOnlineStatusChange = () => {
      checkOnlineStatus();
    };

    // Initialize checks
    checkInstalled();
    checkIOS();
    checkOnlineStatus();
    registerServiceWorker();

    // Development mode: Show install button for testing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('PWA: Development mode - enabling install button for testing');
      setPWAState(prev => ({
        ...prev,
        isInstallable: true,
        canInstall: true,
      }));
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setPWAState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          canInstall: false,
        }));
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    }
    return false;
  };

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  return {
    ...pwaState,
    installApp,
    updateApp,
    deferredPrompt,
  };
}
