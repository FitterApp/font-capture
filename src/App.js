import React, { useState } from "react";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

function App() {
  const [fontUrl, setFontUrl] = useState("");
  const [fontName, setFontName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Updated to handle Google Fonts share URL
  const extractAndLoadFonts = (shareUrl) => {
    const fontNames = extractFontNamesFromShareURL(shareUrl);
    const cssURL = generateGoogleFontsCSSURL(fontNames);

    setIsLoading(true);

    loadGoogleFont(cssURL, fontNames[0]); // Load the first font for simplicity

    setFontName(fontNames[0]);
  };

  const extractFontNamesFromShareURL = (shareUrl) => {
    const params = new URLSearchParams(shareUrl.split("?")[1]);
    const selection = params.get("selection.family");
    if (!selection) return [];
    return selection
      .split("|")
      .map((family) => family.split(":")[0].replace(/\+/g, " "));
  };

  const generateGoogleFontsCSSURL = (fontNames) => {
    const families = fontNames.map((name) => name.replace(/\s+/g, "+"));
    return `https://fonts.googleapis.com/css2?family=${families.join(
      "&family="
    )}&display=swap`;
  };

  const loadGoogleFont = (cssURL, exampleFontName) => {
    const link = document.createElement("link");
    link.href = cssURL;
    link.rel = "stylesheet";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    document.fonts.load(`10pt "${exampleFontName}"`).then(() => {
      setTimeout(() => {
        captureText(exampleFontName);
        setIsLoading(false);
      }, 750);
    });
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
        placeholder="Enter Google Fonts Share URL"
      />
      <button disabled={isLoading} onClick={() => extractAndLoadFonts(fontUrl)}>
        {isLoading ? "loading..." : "Load and Capture Font"}
      </button>
      <div style={{ display: "flex" }}>
        <div
          id="displayArea"
          style={{
            fontFamily: fontName, // This sets the family to the first one for simplicity
            fontSize: "64px",
          }}
        >
          {fontName}
        </div>
      </div>
    </div>
  );
}

export default App;
