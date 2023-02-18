export const sentryOptions = {
  ignoreErrors: [
    // Random plugins/extensions
    "top.GLOBALS",
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "http://tt.epicplay.com",
    "Can't find variable: ZiteReader",
    "jigsaw is not defined",
    "ComboSearch is not defined",
    "http://loading.retry.widdit.com/",
    "atomicFindClose",
    // Facebook borked
    "fb_xd_fragment",
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
    "bmi_SafeAddOnload",
    "EBCallBackMessageReceived",
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    "conduitPage",
    // Avast extension error
    "_avast_submit",
    // Common non-actionable errors
    "rejected transaction",
    "User closed modal",
    "Loading chunk",
    "Failed to execute '",
    "NetworkError when attempting to fetch resource.",
    "googlefc is not defined",
    "__cmp is not defined",
    "Cannot read properties of undefined (reading 'cmp')",
    "Cannot read properties of undefined (reading 'outputCurrentConfiguration')",
    "apstagLOADED is not defined",
    "moat_px is not defined",
    "window.ReactNativeWebView.postMessage is not a function",
    "_reportEvent is not defined",
    "requestAnimationFrame is not defined",
    "window.requestAnimationFrame is not a function",
    "tronLink.setAddress is not a function",
    // benign errors
    "ResizeObserver loop limit exceeded",
    // cannot do anything with these errors
    "Non-Error promise rejection captured",
  ],
  denyUrls: [
    // Google Adsense
    /pagead\/js/i,
    // Facebook flakiness
    /graph\.facebook\.com/i,
    // Facebook blocked
    /connect\.facebook\.net\/en_US\/all\.js/i,
    // Woopra flakiness
    /eatdifferent\.com\.woopra-ns\.com/i,
    /static\.woopra\.com\/js\/woopra\.js/i,
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Other plugins
    // Cacaoweb
    /127\.0\.0\.1:4001\/isrunning/i,
    /webappstoolbarba\.texthelp\.com\//i,
    /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
  ],
};
