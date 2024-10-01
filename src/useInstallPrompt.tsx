import { useEffect, useState } from "react";

export interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string,
  }>;
  prompt(): Promise<void>,
};

function useInstallPrompt():BeforeInstallPromptEvent|null {
  const [ promptEvent , setPromptEvent ] = useState<BeforeInstallPromptEvent|null>(null);
  
  useEffect(() => {
    function beforePromptEventHandler(e: Event) {
      const promptEvent = e as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setPromptEvent(promptEvent);
    }

    window.addEventListener('beforeinstallprompt', beforePromptEventHandler);

    return () => window.removeEventListener('beforeinstallprompt', beforePromptEventHandler);
  }, []);

  return promptEvent;
}

export default useInstallPrompt;
