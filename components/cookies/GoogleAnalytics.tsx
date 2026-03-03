"use client";

import Script from "next/script";

export default function GoogleAnalytics({ GA_ID }: { GA_ID: string }) {
  return (
    <>
      <Script
        id="google-consent-mode"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Verificăm dacă există deja consimțământ în localStorage
            const savedConsent = localStorage.getItem("cookie-consent");
            
            gtag('consent', 'default', {
              'ad_storage': savedConsent === 'accepted' ? 'granted' : 'denied',
              'analytics_storage': savedConsent === 'accepted' ? 'granted' : 'denied',
              'ad_user_data': savedConsent === 'accepted' ? 'granted' : 'denied',
              'ad_personalization': savedConsent === 'accepted' ? 'granted' : 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}