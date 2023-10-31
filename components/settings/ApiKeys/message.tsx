export const Message = {
  NoDomainsTitle: "No Domains Configured",
  NoDomainsDescription:
    "This will deny requests from all origins, rendering the key unusable in frontend applications. Proceed only if you intend to use this key in server or native apps environments.",
  AnyDomainTitle: "Unrestricted Web Access",
  AnyDomainDescription:
    "Requests from all origins will be authorized. If your key is leaked it could be misused.",
  NoBundleIdsTitle: "No Bundle IDs Configured",
  NoBundleIdsDescription:
    "This will deny requests from all native applications, rendering the key unusable. Proceed only if you intend to use this key in server or frontend environments.",
  AnyBundleIdTitle: "Unrestricted App Access",
  AnyBundleIdDescription:
    "Requests from all applications will be authorized. If your key is leaked it could be misused.",
  SecretKeyTitle: "Secret Key Handling",
  SecretKeyDescription: (
    <>
      Do <strong>NOT</strong> share or expose your secret key. Secret keys
      cannot be recovered. If you lose your secret key, you will need to create
      a new API Key pair.
    </>
  ),
};

export default Message;
