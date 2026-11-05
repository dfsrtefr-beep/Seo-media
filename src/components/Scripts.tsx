import Script from "next/script";

export function Scripts() {
  const ga4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const gtm = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID;

  return (
    <>
      {gtm && (
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
          }}
        />
      )}
      {ga4 && (
        <>
          <Script
            id="ga4"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`,
            }}
          />
        </>
      )}
    </>
  );
}
