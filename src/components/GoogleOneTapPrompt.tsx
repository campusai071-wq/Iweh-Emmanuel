import React, { useEffect } from 'react';
import { initGoogleOneTap, cancelGoogleOneTap } from '../services/googleOneTapService';

interface GoogleOneTapPromptProps {
  user: any;
  isAuthLoading: boolean;
}

export const GoogleOneTapPrompt: React.FC<GoogleOneTapPromptProps> = ({ user, isAuthLoading }) => {
  useEffect(() => {
    // Only invoke when not logged in and auth check has settled
    if (!isAuthLoading && !user) {
      // Small delay to ensure DOM and Google Identity Services script have loaded
      const timer = setTimeout(() => {
        initGoogleOneTap();
      }, 1500);

      return () => {
        clearTimeout(timer);
        cancelGoogleOneTap();
      };
    }
  }, [user, isAuthLoading]);

  return null;
};

export default GoogleOneTapPrompt;
