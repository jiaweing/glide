"use client";

import Cookies from "js-cookie";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes("android-app://")
  );
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Don't show if already installed
    if (isStandalone()) return;

    // Don't show on desktop
    if (!isMobile()) return;

    // Check if user has already seen the prompt
    const hasSeenPrompt = Cookies.get("pwa-prompt-seen");
    if (hasSeenPrompt) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the prompt
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !isStandalone()) {
      // Show iOS-specific install prompt
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // If it's iOS, just close the prompt as we can't programmatically install
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      handleDismiss();
      return;
    }

    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);

    // Hide the prompt
    setShowPrompt(false);

    // Set cookie to not show again
    Cookies.set("pwa-prompt-seen", "true", { expires: 365 });
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Set cookie to not show again
    Cookies.set("pwa-prompt-seen", "true", { expires: 365 });
  };

  if (!showPrompt) return null;

  // Check if it's iOS to show different instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const installText = isIOS
    ? "To install, tap the share button below and select 'Add to Home Screen'"
    : "Install our app for a better experience. You can access it anytime from your home screen.";

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 md:left-auto md:right-4 md:w-96">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Install App</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{installText}</p>
          <div className="mt-4 flex space-x-4">
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Install
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {isIOS ? "Got it" : "Maybe Later"}
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
