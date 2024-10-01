import { useEffect, useState } from "react";

export interface UserChoice {
  outcome: 'accepted' | 'dismissed';
  platform: string;
};

export interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<UserChoice>;
  prompt(): Promise<UserChoice>,
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
