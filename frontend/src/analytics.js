const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;
let scriptLoaded = false;

export function hasAnalyticsConsent() {
  return localStorage.getItem("yumigo-analytics-consent") === "accepted";
}

export function initializeAnalytics() {
  if (initialized || !GA_ID || !hasAnalyticsConsent()) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });

  if (!scriptLoaded) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    scriptLoaded = true;
  }

  initialized = true;
}

export function trackEvent(name, params = {}) {
  if (!initialized || !hasAnalyticsConsent()) return;
  window.gtag("event", name, params);
}

export function trackPageView(path) {
  trackEvent("page_view", {
    page_title: document.title,
    page_location: window.location.origin + path,
    page_path: path
  });
}
