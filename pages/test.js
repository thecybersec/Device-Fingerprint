import { useEffect, useState } from "react";
import { SHA256 } from "crypto-js";
const Test = () => {
  const [fingerprint, setFingerprint] = useState(null);
  const [screenInfo, setScreenInfo] = useState(null);
  useEffect(() => {
    const extractData = () => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      const cookiesEnabled = navigator.cookieEnabled;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const contentLanguage = navigator.language;
      const canvas = (() => {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        const txt = "abcdefghijklmnopqrstuvwxyz0123456789";
        ctx.textBaseline = "top";
        ctx.font = '14px "Arial"';
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(0, 0, 150, 30);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);
        return c.toDataURL();
      })();
      const fonts = (() => {
        const f = [];
        const t = document.createElement("div");
        const s = document.createElement("span");
        s.textContent = "abcdefghijklmnopqrstuvwxyz0123456789";
        s.style.fontSize = "72px";
        t.appendChild(s);
        document.body.appendChild(t);
        for (let i = 0; i < s.offsetWidth; i += 10) {
          t.style.fontFamily = `testFont${i}`;
          if (s.offsetWidth !== t.offsetWidth) {
            f.push(`testFont${i}`);
          }
        }
        document.body.removeChild(t);
        return f;
      })();
      const adblockEnabled = (() => {
        const test = document.createElement("div");
        test.innerHTML = "&nbsp;";
        test.className = "adsbox";
        let result = false;
        try {
          document.body.appendChild(test);
          result =
            document.getElementsByClassName("adsbox")[0].offsetHeight === 0;
          document.body.removeChild(test);
        } catch (e) {
          result = false;
        }
        return result;
      })();
      const doNotTrack =
        navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
      const navigatorProperties = {
        buildID: navigator.buildID,
        product: navigator.product,
        productSub: navigator.productSub,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
        hardwareConcurrency: navigator.hardwareConcurrency,
        javaEnabled: navigator.javaEnabled(),
        deviceMemory: navigator.deviceMemory,
        plugins: (() => {
          const p = [];
          for (let i = 0; i < navigator.plugins.length; i++) {
            const plugin = navigator.plugins[i];
            p.push({
              name: plugin.name,
              filename: plugin.filename,
              description: plugin.description,
            });
          }
          return p;
        })(),
      };

      const handleLoad = () => {
        const screen = {
          width: window.screen?.width,
          height: window.screen?.height,
          depth: window.screen?.colorDepth,
          availableTop: window.screen?.availTop,
          availableLeft: window.screen?.availLeft,
          availableHeight: window.screen?.availHeight,
          availableWidth: window.screen?.availWidth,
          left: window.screenLeft,
          top: window.screenTop,
        };
        setScreenInfo(screen);
      };
      handleLoad();
      const permissions = (() => {
        const p = [];
        navigator.permissions.query({ name: "camera" }).then((result) => {
          p.push({
            name: "camera",
            state: result.state,
          });
        });
        navigator.permissions.query({ name: "microphone" }).then((result) => {
          p.push({
            name: "microphone",
            state: result.state,
          });
        });
        return p;
      })();
      const webgl = (() => {
        const gl = document.createElement("canvas").getContext("webgl");
        if (!gl) {
          return null;
        }
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const data = gl.getParameter(gl.VERSION);
        const params = {
          antialias: gl.getContextAttributes().antialias,
          depth: gl.getContextAttributes().depth,
          stencil: gl.getContextAttributes().stencil,
          alpha: gl.getContextAttributes().alpha,
        };
        return {
          vendor,
          renderer,
          data,
          params,
        };
      })();
      const storage = {
        localStorage: typeof window.localStorage !== "undefined",
        sessionStorage: typeof window.sessionStorage !== "undefined",
        indexedDB: typeof window.indexedDB !== "undefined",
      };
      const audioFormats = (() => {
        const a = document.createElement("audio");
        const formats = {};
        for (let i = 0; i < a.canPlayType.length; i++) {
          const type = a.canPlayType[i];
          if (type !== "") {
            formats[type] = true;
          }
        }
        return Object.keys(formats);
      })();
      const headers = {
        secChUaName: navigator.userAgent,
        contentLanguage,
        secChUaPlatformName: navigator.platform,
        accept: navigator.accept,
        secChUaMobileName: navigator.userAgent,
        upgradeInsecureRequests: navigator.upgradeInsecureRequests,
        contentEncoding: navigator.contentEncoding,
      };
      const data = {
        userAgent,
        platform,
        cookiesEnabled,
        timezone,
        contentLanguage,
        canvas,
        fonts,
        adblockEnabled,
        doNotTrack,
        navigatorProperties,
        screenInfo,
        permissions,
        webgl,
        storage,
        audioFormats,
        headers,
      };
      return JSON.stringify(data);
    };

    const generateFingerprint = () => {
      const data = extractData();
      const fingerprint = SHA256(data).toString();

      setFingerprint(fingerprint);
    };

    generateFingerprint();
  }, []);

  const design = (
    <>
      <p>{fingerprint}</p>
    </>
  );
  return design;
};

export default Test;
