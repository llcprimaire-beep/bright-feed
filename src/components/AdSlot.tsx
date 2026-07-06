import Script from "next/script";

// Placeholder until NEXT_PUBLIC_ADSENSE_CLIENT_ID is set post-approval; then
// real AdSense units render with no code change. Fixed min-height avoids CLS.
export default function AdSlot({ slot }: { slot: string }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    return (
      <div
        className="break-inside-avoid mb-6 min-h-[110px] flex items-center justify-center rounded-3xl border-2 border-dashed border-peach text-xs font-semibold text-muted/60"
        aria-hidden
      >
        Ad space
      </div>
    );
  }

  return (
    <div className="break-inside-avoid mb-6 min-h-[110px]">
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <ins
        className="adsbygoogle block"
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsbygoogle-init-${slot}`} strategy="lazyOnload">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
