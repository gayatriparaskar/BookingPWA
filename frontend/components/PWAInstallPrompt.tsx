import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

export default function PWAInstallPrompt({ onInstall, onDismiss }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      // Check if running in standalone mode
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isInStandaloneMode = (window.navigator as any).standalone === true;
      const isStandaloneApp = isStandaloneMode || isInStandaloneMode;
      
      setIsStandalone(isStandaloneApp);
      setIsInstalled(isStandaloneApp);
    };

    // Check if running on iOS
    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = (window.navigator as any).standalone === true;
      setIsIOS(isIOSDevice && !isInStandaloneMode);
    };

    checkInstalled();
    checkIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay
      setTimeout(() => {
        if (!isInstalled && !isStandalone) {
          setShowInstallPrompt(true);
        }
      }, 3000); // Show after 3 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      onInstall?.();
    };

    // Listen for display mode changes
    const handleDisplayModeChange = () => {
      checkInstalled();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, [isInstalled, isStandalone, onInstall]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        onInstall?.();
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    onDismiss?.();
    
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or if user recently dismissed
  if (isInstalled || isStandalone) {
    return null;
  }

  // Check if user recently dismissed (within 24 hours)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime) {
    const timeSinceDismissed = Date.now() - parseInt(dismissedTime);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (timeSinceDismissed < twentyFourHours) {
      return null;
    }
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <Card className="bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg">Install Luxe Salon</h3>
                    <p className="text-sm text-white/80">Get the full app experience</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4">
                {isIOS ? (
                  // iOS specific instructions
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-bold">1</span>
                      </div>
                      <span>Tap the Share button in Safari</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-bold">2</span>
                      </div>
                      <span>Scroll down and tap "Add to Home Screen"</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-bold">3</span>
                      </div>
                      <span>Tap "Add" to install the app</span>
                    </div>
                  </div>
                ) : (
                  // Android/Desktop instructions
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-white/80" />
                      <span className="text-sm">Access from your home screen</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-white/80" />
                      <span className="text-sm">Works offline with cached content</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-5 w-5 text-white/80" />
                      <span className="text-sm">Faster loading and better performance</span>
                    </div>
                  </div>
                )}

                {/* Install Button */}
                <div className="mt-6">
                  {isIOS ? (
                    <Button
                      onClick={handleDismiss}
                      className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Got it!
                    </Button>
                  ) : (
                    <Button
                      onClick={handleInstallClick}
                      className="w-full bg-white text-rose-600 hover:bg-white/90 font-semibold"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Install App
                    </Button>
                  )}
                </div>

                {/* Benefits */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/70 text-center">
                    ✨ Quick access • 📱 Native feel • ⚡ Faster loading
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
