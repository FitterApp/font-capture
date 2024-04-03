import React, { useState } from "react";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

function App() {
  const [fontUrl, setFontUrl] = useState("");
  const [fontNames, setFontNames] = useState([]); // Use an array to store font names
  const [isLoading, setIsLoading] = useState(false);

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

  const extractAndLoadFonts = (shareUrl) => {
    const extractedFontNames = extractFontNamesFromShareURL(shareUrl);
    const cssURL = generateGoogleFontsCSSURL(extractedFontNames);
    setIsLoading(true);
    loadGoogleFont(cssURL);
    setFontNames(extractedFontNames); // Store all font names
  };

  // Load the CSS for all fonts but don't capture automatically
  const loadGoogleFont = (cssURL) => {
    const link = document.createElement("link");
    link.href = cssURL;
    link.rel = "stylesheet";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    setIsLoading(false);
  };

  const captureAndDownload = (fontName) => {
    htmlToImage
      .toPng(document.getElementById(fontName))
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
        {isLoading ? "Loading..." : "Load Fonts"}
      </button>
      <div>
        {fontNames.map((fontName, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <div
              id={fontName} // Use the font name as the ID for unique identification
              style={{
                fontFamily: fontName,
                fontSize: "64px",
              }}
            >
              {fontName}
            </div>
            <button onClick={() => captureAndDownload(fontName)}>
              Download Image
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
