import {
  appleLogo,
  bitbucketLogo,
  discordLogo,
  facebookLogo,
  githubLogo,
  gitlabLogo,
  googleLogo,
  linkedinLogo,
  MagicLogo,
  microsoftLogo,
  twitchLogo,
  twitterLogo,
} from "./logos";
import { modalStyles } from "./styles";
import { OAuthProvider } from "@magic-ext/oauth";

export const createModal = async (props: {
  accentColor?: string;
  isDarkMode?: boolean;
  customLogo?: string;
  customHeaderText?: string;
  enableSMSLogin?: boolean;
  enableEmailLogin?: boolean;
  oauthProviders?: OAuthProvider[];
}) => {
  // INJECT FORM STYLES
  const style = document.createElement("style");
  style.innerHTML = modalStyles(props.accentColor);
  document.head.appendChild(style);

  // PROVIDERS FOR OAUTH BUTTONS
  const allProviders = [
    { name: "google", icon: googleLogo },
    { name: "facebook", icon: facebookLogo },
    { name: "apple", icon: appleLogo },
    { name: "github", icon: githubLogo },
    { name: "bitbucket", icon: bitbucketLogo },
    { name: "gitlab", icon: gitlabLogo },
    { name: "linkedin", icon: linkedinLogo },
    { name: "twitter", icon: twitterLogo },
    { name: "discord", icon: discordLogo },
    { name: "twitch", icon: twitchLogo },
    { name: "microsoft", icon: microsoftLogo },
  ];

  // make providers included in oauthProviders
  const providers = props.oauthProviders
    ?.map((provider) => {
      return allProviders.find((p) => p.name === provider);
    })
    .filter((p) => p !== undefined);

  const phoneNumberRegex = `(\\+|00)[0-9]{1,3}[0-9]{4,14}(?:x.+)?$`;
  const emailRegex = `^([a-zA-Z0-9_.-])+(\\+[a-zA-Z0-9-]+)?@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})`;

  // MODAL HTML
  const modal = `
    <div class="Magic__formContainer ${
      props.isDarkMode ? `Magic__dark` : ``
    }" id="MagicModalBody">
      <button class="Magic__closeButton" id="MagicCloseBtn">&times;</button>
      <div class="Magic__formHeader">
        ${
          props.customLogo
            ? `<img class="Magic__customLogo" src="${props.customLogo}" />`
            : `<div class="Magic__logo">${MagicLogo}</div>`
        }
        <h1 class='Magic__logoText'> ${props.customHeaderText || "Magic"} </h1>

        <form class="Magic__formBody" id="MagicForm">
          ${
            props.enableSMSLogin && props.enableEmailLogin
              ? `
               <label class="Magic__FormLabel">Sign-in with Phone or Email</label>
               <input class="Magic__formInput" id="MagicFormInput" required pattern = "${emailRegex}|${phoneNumberRegex}" placeholder="Phone or Email" />
               `
              : props.enableEmailLogin
              ? `
               <label class="Magic__FormLabel">Sign-in with Email</label>
               <input class="Magic__formInput" id="MagicFormInput" required type="email" placeholder="address@example.com" />
               `
              : props.enableSMSLogin
              ? `
                <label class="Magic__FormLabel">Sign-in with Phone</label>
                <input class="Magic__formInput" id="MagicFormInput" required type="tel" pattern="${phoneNumberRegex}" placeholder="+11234567890" />
              `
              : ``
          }
          ${
            props.enableSMSLogin || props.enableEmailLogin
              ? ` <button class="Magic__submitButton" type="submit">
                Send login link
              </button>`
              : ``
          }
        </form>
        ${
          providers &&
          providers.length > 0 &&
          (props.enableSMSLogin || props.enableEmailLogin)
            ? `<div class="Magic__divider">
        &#9135;&#9135;&#9135; OR &#9135;&#9135;&#9135;
        </div>`
            : ``
        }
        <div class="${
          !props.enableEmailLogin && !props.enableSMSLogin
            ? `Magic__oauthButtonsContainer Magic__aloneOauthContainer`
            : `Magic__oauthButtonsContainer`
        }">
          ${providers
            ?.map((provider) => {
              return `
                <button class="Magic__oauthButton" id="MagicOauth${
                  provider?.name
                }" data-provider="${provider?.name}" >
                  <span class="Magic__oauthButtonIcon">${provider?.icon}</span>
                  ${
                    !props.enableSMSLogin && !props.enableEmailLogin
                      ? `<span class="Magic__oauthButtonName">${provider?.name}</span>`
                      : ``
                  }
                </button>
              `;
            })
            .join("")}
        </div>
        ${
          !props.enableEmailLogin &&
          !props.enableEmailLogin &&
          providers?.length === 0
            ? `<div>No Login Methods Configured 😥</div>`
            : ``
        }
      </div>
    </div>
  `;

  // ADD FORM TO BODY
  const overlay = document.createElement("div");
  overlay.classList.add("Magic__formOverlay");
  if (props.isDarkMode) {
    overlay.classList.add("Magic__dark");
  }
  document.body.appendChild(overlay);
  overlay.innerHTML = modal;
  const formBody = document.getElementById("MagicModalBody");
  setTimeout(() => {
    if (formBody) {
      formBody.style.transform = "translate(-50%, -50%) scale(1)";
    }
  }, 100);

  // FORM SUBMIT HANDLER
  const removeForm = () => {
    if (formBody) {
      formBody.style.transform = "translate(-50%, -50%) scale(0)";
    }
    setTimeout(() => {
      overlay.remove();
    }, 200);
  };

  return new Promise((resolve) => {
    // FORM CLOSE BUTTON
    document.getElementById("MagicCloseBtn")?.addEventListener("click", () => {
      removeForm();
      resolve({
        email: "",
        phoneNumber: "",
        isGoogle: false,
        isDiscord: false,
      });
    });

    // EMAIL FORM SUBMIT HANDLER
    document.getElementById("MagicForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const formInputField = document.getElementById(
        "MagicFormInput",
      ) as HTMLInputElement;
      const isFormValid = formInputField?.checkValidity();
      if (isFormValid) {
        let output;
        if (RegExp(phoneNumberRegex).test(formInputField.value)) {
          output = {
            phoneNumber: formInputField?.value,
          };
        } else {
          output = {
            email: formInputField?.value,
          };
        }
        removeForm();
        resolve(output);
      }
    });

    // OAUTH BUTTONS
    providers?.forEach((provider) => {
      const oauthButton = document.getElementById(
        `MagicOauth${provider?.name}`,
      );
      oauthButton?.addEventListener("click", () => {
        const output = {
          oauthProvider: provider?.name as OAuthProvider,
        };
        removeForm();
        resolve(output);
      });
    });
  });
};
