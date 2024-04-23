---
"thirdweb": minor
---

Add support for connecting in-app wallet using phone number

## Usage in TypeScript

```ts
import { createThirdwebClient, createWallet } from "thirdweb";
import { preAuthenticate } from "thirdweb/wallets/in-app";

const client = createThirdwebClient({ clientId: "..." });

const phoneNumber = '+123456789';

// Send OTP to given phone number
async function sendOTP() {
  await preAuthenticate({
    strategy: "phone",
    phoneNumber,
    client,
  });
}

async function connect() {
  // create a in-app wallet instance
  const wallet = createWallet('inApp');
  // if the OTP is correct, the wallet will be connected else an error will be thrown
  const account = await wallet.connect({
    client,
    strategy: "phone";
    phoneNumber,
    verificationCode: '...' // Pass the OTP entered by the user
  });

  console.log('connected to', account);
}
```

## Usage in React

```tsx
import { createThirdwebClient } from "thirdweb";
import { preAuthenticate } from "thirdweb/wallets/in-app";
import { useConnect } from "thirdweb/react";

const client = createThirdwebClient({ clientId: "..." });

function Component() {
  const { connect } = useConnect();
  const [phoneNumber, setPhoneNumber] = useState(''); // get phone number from user
  const [otp, setOtp] = useState(''); // get OTP from user

  // Send OTP to given phone number
  async function sendOTP() {
    await preAuthenticate({
      strategy: "phone",
      phoneNumber,
      client,
    });
  }

  async function connect() {
    // create a in-app wallet instance
    const wallet = createWallet('inApp');
    // if the OTP is correct, the wallet will be connected else an error will be thrown
    await wallet.connect({
      client,
      strategy: "phone";
      phoneNumber,
      verificationCode: otp
    });

    // set the wallet as active
    connect(wallet)
  }

  // render UI to get OTP and phone number from user
  return <div> ...  </div>
}
```
