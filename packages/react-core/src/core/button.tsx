import { css, html } from "react-strict-dom";

// eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
const styles = css.create({
  container: {
    // display: "flex",
    // flex: 1,
    // flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    borderTopWidth: 1,
  },
  button: {
    borderRadius: 20,
    backgroundColor: "#700fad",
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },
  buttonText: {
    color: "white",
    position: "relative",
    fontWeight: "bold",
  },
});

export function ButtonRSD() {
  return (
    <html.div style={styles.container}>
      <html.button style={styles.button} onClick={() => alert("Hello World")}>
        <html.p style={styles.buttonText}>Click me</html.p>
      </html.button>
    </html.div>
  );
}
