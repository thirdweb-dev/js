import { css } from '@emotion/css'

const getStyles = () => ({
  searchContainer: css`
    position: relative;
    display: inline-block;
  `,
  searchBarContainer: css`
    display: flex;
    margin-left: auto;
    margin-right: auto;
    justify-self: center;
    width: 500px;
    border: 3px solid: #ccc;
    border-radius: 13px;
    box-sizing: border-box;
    height: 63.5px;
    position: relative;

    &:focus {
      outline: none;
    }

    @media (max-width: 720px) {
      width: 350px;
    }
  `,
  networkImage: css`
    margin-left: 10px;
    margin-top: 12px;
    margin-right: 0px;
    width: 30px;
  `,
  searchBar: css`
    height: 100%;
    width: 100%;
    flex: 1;
    font-size: 20px;
    border-radius: 12px;
    background-color: transparent;
    padding: 12px 20px 12px 10px;
    align-items: center;
    justify-self: center;
    border: none;
    cursor: pointer;
  `,
  clearButton: css`
    background: none;
    border: none;
    cursor: pointer;
    color: #ccc;
    font-size: 1.5em;
    background-color: rgba(231, 232, 232, 0.407);
    width: 60px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  `,
  suggestionsContainer: css`
    position: absolute;
    left: 0;
    top: 68px; 
    justify-self: center;
    border-radius: 12px;
    width: 500px;
    padding: 12px 20px;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    flex: 1;

    @media (max-width: 720px) {
      width: 350px;
    }
  `,
  suggestion: css`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    margin-top: 8px;

    &:hover {
      background-color: #e7e8e8;
      color: #070707;
      border-radius: 5px;
      padding: 5px;
    }
  `,
  suggestionLogo: css`
    width: 24px;
    height: 24px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  `,
  suggestionText: css`
    flex: 1;
  `,
});

export default getStyles
