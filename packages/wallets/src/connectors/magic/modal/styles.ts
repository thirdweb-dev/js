export const modalStyles = (accentColor = "#6452f7") => `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');  
.Magic__formOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(6px);
    z-index: 2147483647;
  }
 .Magic__formOverlay.Magic__dark {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .Magic__formContainer {
    display: flex;
    flex-direction: column;
    font-family: 'Inter', sans-serif;
    text-align: center;
    gap: 30px;
    align-items: center;
    justify-content: start;
    position: fixed;
    overflow: hidden;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: all 0.2s ease-in-out;
    width: min(400px, 90%);
    z-index: 9999;
    box-shadow: 0 12px 56px rgb(119 118 122 / 15%);
    border-radius: 30px;
    padding: 80px 20px;
    background-color: #fff;
  }
  .Magic__formContainer.Magic__dark {
    background-color: #333333;
    box-shadow: 0 12px 56px #00000021;
    color: white;
  }
  .Magic__closeButton {
    position: absolute;
    top: 0;
    right: 15px;
    padding: 10px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 30px;
    color: #ccc;
    z-index: 9999;
  }
  .Magic__dark .Magic__closeButton {
    color: #555;
  }
  .Magic__formHeader{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;
  }
  .Magic__customLogo{
    height: 80px;
    object-fit: contain;
  }
  .Magic__logoText{
    font-size: 22px;
    font-weight: bold;
    color: #333;
  }
  .Magic__dark .Magic__logoText{
    color: white;
  }
  .Magic__formBody{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 100%;
  }
  .Magic__formLabel{
    font-size: 17px;
    font-weight: 500;
  }
  .Magic__formInput {
    padding: 10px;
    width: 100%;
    height: 45px;
    max-width: 300px;
    text-align: center;
    margin-bottom: 10px;
    border-width: 1px;
    border-style: solid;
    border-color: #D6D6D6;
    color: #333;
    font-size: 17px;
    font-weight: 400;
    border-radius: 10px;
    accent-color: ${accentColor};
    background-color: transparent;
  }
  .Magic__dark .Magic__formInput {
    border-color: #444;
    color: white;
  }
  .Magic__formInput::placeholder { 
    color: #D6D6D6;
    opacity: 1; 
  }
  .Magic__dark .Magic__formInput::placeholder {
    color: #555;
  }
  .Magic__divider {
      display: block;
      text-align: center;
      color: #D6D6D6;
      font-size: 14px;
  }
  .Magic__dark .Magic__divider {
    color: #444;
  }
  .Magic__submitButton {
    display: block;
    width: 100%;
    max-width: 300px;
    padding: 15px 30px;
    border: none;
    cursor: pointer;
    color: white;
    margin-bottom: 10px;
    font-size: 17px;
    font-weight: 500;
    border-radius: 100px;
    background-color: ${accentColor};
  }
  .Magic__submitButton:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0 0)
  }
  .Magic__oauthButtonsContainer{
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    width: 90%;
  }
  .Magic__oauthButton{
    display: block;
    padding: 5px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    border-radius: 100px;
  }
  .Magic__aloneOauthContainer > .Magic__oauthButton{
    width: 100%;
    max-width: 300px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    border: 1px solid #D6D6D6;
    color: #333;
  }
  .Magic__dark .Magic__aloneOauthContainer > .Magic__oauthButton{
    border-color: #444;
    color: white;
  }
  .Magic__aloneOauthContainer .Magic__oauthButtonIcon > svg{
    width: 30px;
    margin-top: 5px;
  }
  .Magic__aloneOauthContainer .Magic__oauthButtonName{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    text-transform: capitalize;
  }
`;
