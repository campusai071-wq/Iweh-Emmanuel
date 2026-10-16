import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { auth, GOOGLE_CLIENT_ID } from "./firebaseConfig";
import { initializeUserProfile, trackReferral } from "./userService";
import { trackSignUp } from "./analytics";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string; select_by?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: 'signin' | 'signup' | 'use';
            itp_support?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (notification?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
            getDismissedReason: () => string;
          }) => void) => void;
          renderButton?: (parent: HTMLElement, options: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export interface OneTapOptions {
  context?: 'signin' | 'signup' | 'use';
  onSuccess?: (email: string) => void;
  onError?: (error: any) => void;
}

let isInitialized = false;

export const initGoogleOneTap = (options: OneTapOptions = {}) => {
  if (typeof window === 'undefined') return;
  if (Capacitor.isNativePlatform()) return;

  if (!GOOGLE_CLIENT_ID) {
    console.warn("[GoogleOneTap] Google Client ID is not configured.");
    return;
  }

  // If user is already authenticated in Firebase, skip One Tap
  if (auth.currentUser) {
    return;
  }

  const runInit = () => {
    if (!window.google?.accounts?.id) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response.credential) return;
          try {
            const credential = GoogleAuthProvider.credential(response.credential);
            const userCred = await signInWithCredential(auth, credential);
            
            if (userCred.user) {
              const referralCode = localStorage.getItem('campusai_referral_code');
              if (referralCode) {
                try {
                  await trackReferral(referralCode, userCred.user.uid);
                } catch (e) {}
                localStorage.removeItem('campusai_referral_code');
              }

              await initializeUserProfile(userCred.user, undefined, {
                displayName: userCred.user.displayName || undefined,
                email: userCred.user.email || undefined,
                photoURL: userCred.user.photoURL || undefined
              });

              trackSignUp({ method: 'google_one_tap', role: 'Pre-Admission', user_id: userCred.user.uid });
              options.onSuccess?.(userCred.user.email || 'google-user');
            }
          } catch (err) {
            console.error("[GoogleOneTap] Authentication failed:", err);
            options.onError?.(err);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        context: options.context || 'signin',
        itp_support: true,
        use_fedcm_for_prompt: true
      });

      isInitialized = true;

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.debug("[GoogleOneTap] Prompt not displayed:", notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.debug("[GoogleOneTap] Prompt skipped:", notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.debug("[GoogleOneTap] Prompt dismissed:", notification.getDismissedReason());
        }
      });
    } catch (e) {
      console.warn("[GoogleOneTap] Initialization error:", e);
    }
  };

  if (window.google?.accounts?.id) {
    runInit();
  } else {
    // Retry if script is still loading async
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.google?.accounts?.id) {
        clearInterval(interval);
        runInit();
      } else if (attempts > 20) {
        clearInterval(interval);
      }
    }, 250);
  }
};

export const cancelGoogleOneTap = () => {
  if (typeof window !== 'undefined' && window.google?.accounts?.id) {
    try {
      window.google.accounts.id.cancel();
    } catch (e) {}
  }
};
