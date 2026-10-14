import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  hasAnalyticsConsent,
  initializeAnalytics,
  trackPageView
} from "./analytics";

export default function AnalyticsPageTracker() {
  const location = useLocation();

  useEffect(() => {
    const sendPageView = () => {
      if (!hasAnalyticsConsent()) return;

      initializeAnalytics();
      trackPageView(location.pathname + location.search);
    };

    const handleConsentGranted = () => {
      sendPageView();
    };

    window.addEventListener(
      "yumigo-consent-granted",
      handleConsentGranted
    );

    sendPageView();

    return () => {
      window.removeEventListener(
        "yumigo-consent-granted",
        handleConsentGranted
      );
    };
  }, [location.pathname, location.search]);

  return null;
}
