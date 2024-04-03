import React, { useState } from "react";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

function App() {
  const [fontUrl, setFontUrl] = useState("");
  const [fontName, setFontName] = useState("");

  const extractFontName = (fontUrl) => {
    // Example URL: https://fonts.googleapis.com/css2?family=Rubik+Doodle+Shadow&display=swap
    const regex = /family=([^:&]+)/;
    const matches = fontUrl.match(regex);
    return matches && matches[1].replace(/\+/g, " ");
  };

  const handleLoadFont = () => {
    const name = extractFontName(fontUrl);
    setFontName(name);
    loadGoogleFont(name);
  };

  const loadGoogleFont = (fontName) => {
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    document.fonts.load(`10pt "${fontName}"`).then(() => {
      injectCustomCSS(fontName);
      setTimeout(() => {
        captureText(fontName);
      }, 400);
    });
  };

  const injectCustomCSS = (fontName) => {
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
        @font-face {
            font-family: "${fontName}", system-ui;
            font-weight: 400;
            font-style: normal;
        }
    `;
    document.head.appendChild(style);
  };

  const captureText = (fontName) => {
    const displayArea = document.getElementById("displayArea");
    htmlToImage
      .toPng(displayArea)
      .then(function (dataUrl) {
        saveAs(dataUrl, `${fontName}.png`);
      })
      .catch(function (error) {
        console.error("Could not generate image", error);
      });
  };

  return (
    <div className="App">
      <input
        type="text"
        value={fontUrl}
        onChange={(e) => setFontUrl(e.target.value)}
        placeholder="Enter Google Fonts URL"
      />
      <button onClick={handleLoadFont}>Load and Capture Font</button>
      <div style={{ display: "flex" }}>
        <div
          id="displayArea"
          style={{
            fontFamily: fontName,
            fontSize: "24px",
          }}
        >
          {fontName}
        </div>
      </div>
    </div>
  );
}

export default App;
