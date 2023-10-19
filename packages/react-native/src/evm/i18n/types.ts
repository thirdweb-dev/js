export type Locale = LocaleType | "en" | "es";

export type LocaleType = typeof _en;

export const _en = {
  connect_wallet: {
    label: "Connect Wallet",
  },
  connect_wallet_details: {
    additional_actions: "Additional Actions",
    address_copied_clipboard: "Address copied to clipboard",
    backup_wallet: "Backup Wallet",
    backup_personal_wallet: "Backup personal wallet",
    import_wallet: "Import Wallet",
    connected_to_smart_wallet: "Connected to a Smart Wallet",
    current_network: "Current Network",
    backup: "Backup",
    connect_to_app: "Connect to App",
    guest: "Guest",
    connect: "Connect",
    new_to_wallets: "New to wallets?",
    get_started: "Get started",
    receive_funds: "Receive Funds",
    connect_a_wallet: "Connect a wallet",
    continue_as_guest: "Continue as guest",
    tos: "Terms of Service",
    privacy_policy: "Privacy Policy",
    by_connecting_you_agree: "By connecting, you agree to the",
    copy_address_or_scan:
      "Copy the wallet address or scan the QR code to send funds to this wallet.",
    request_testnet_funds: "Request Testnet Funds",
    view_transatcion_history: "View Transaction History",
    your_address: "Your address",
    qr_code: "QR Code",
    select_token: "Select Token",
    send_to: "Send to",
    no_tokens_found: "No Tokens found",
    confirm_in_wallet: "Confirm in your wallet",
    select_network: "Select Network",
    switch_to: "Switch to",
    no_supported_chains_detected: "No supported chains detected",
    recommended: "Recommended",
    network_mismatch:
      "There's a network mismatch between your contract and your wallet",
  },
  connecting_wallet: {
    creating_encrypting:
      "Creating, encrypting and securing your device wallet.",
    connecting_your_wallet: "Connecting your wallet",
    connecting_through_pop_up:
      "Login and connect your app through the wallet pop-up",
  },
  local_wallet: {
    create_new_wallet: "Create new wallet",
    private_key_mnemonic: "Or Private key or Mnemonic",
    private_key_mnemonic_placeholder: "Private key / Mnemonic",
    application_can_authorize_transactions:
      "The application can authorize any transactions on behalf of the wallet without any approvals. We recommend only connecting to trusted applications.",
    double_check_password: "Please, double check your password or private key.",
    error_accessing_file: "Error accessing the file. Please try again.",
    wallet_address: "Wallet Address",
    this_will_download_json:
      "This will download a JSON file containing your wallet information onto your device encrypted with the password.",
    this_is_a_temporary_wallet:
      "This is a temporary guest wallet. Download a backup if you don't want to loose access to it.",
  },
  smart_wallet: {
    switch_to_smart: "Switch to Smart Wallet",
    switch_to_personal: "Switch to Personal Wallet",
  },
  embedded_wallet: {
    request_new_code: "Request new code",
    sign_in: "Sign In",
  },
  wallet_connect: {
    no_results_found: "No results found",
  },
  common: {
    password: "Password",
    reject: "Reject",
    approve: "Approve",
    switch_network: "Switch Network",
    import: "Import",
    username: "Username",
    amount: "Amount",
    send: "Send",
    continue: "Continue",
    error_switching_network: "Error switching network",
    or: "OR",
    from: "from",
    to: "from",
  },
};
