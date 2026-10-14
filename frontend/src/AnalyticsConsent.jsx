import { useState } from "react";
import { initializeAnalytics } from "./analytics";

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState(
    () => localStorage.getItem("yumigo-analytics-consent")
  );

  if (choice) return null;

  function choose(value) {
    localStorage.setItem("yumigo-analytics-consent", value);
    setChoice(value);

    if (value === "accepted") {
      initializeAnalytics();
      window.dispatchEvent(new Event("yumigo-consent-granted"));
    }
  }

  return (
    <aside
      role="dialog"
      aria-labelledby="yumigo-consent-title"
      className="fixed bottom-5 left-5 z-[9999] w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      <h2
        id="yumigo-consent-title"
        className="text-base font-semibold tracking-tight text-stone-900"
      >
        Your privacy matters
      </h2>

      <p className="mt-2 text-sm leading-6 text-stone-600">
        We use analytics to understand how people use Yumigo and improve
        your experience. You can choose whether to allow it.
      </p>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => choose("rejected")}
          className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={() => choose("accepted")}
          className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Accept analytics
        </button>
      </div>
    </aside>
  );
}