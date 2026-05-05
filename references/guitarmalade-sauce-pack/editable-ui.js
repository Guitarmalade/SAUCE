(function () {
  var pageId = document.body.dataset.page || "page";
  var textPrefix = "sauce-mockup:text:";
  var themeKey = "sauce-mockup:theme";
  var pageKey = textPrefix + pageId;
  var editableElements = Array.prototype.slice.call(
    document.querySelectorAll("[data-edit]")
  );

  if (!editableElements.length) {
    return;
  }

  var themeFields = [
    { label: "Page bg", variable: "--bg", fallback: "#f3f7fc" },
    { label: "Panels", variable: "--panel", fallback: "#ffffff" },
    { label: "Text", variable: "--ink", fallback: "#17233d" },
    { label: "Accent", variable: "--blue", fallback: "#3f74f8" },
    { label: "Borders", variable: "--line", fallback: "#d8e2ef" },
    { label: "Dark pod", variable: "--panel-dark", fallback: "#121b39" },
  ];

  var pageEdits = readStore(pageKey);
  var themeEdits = readStore(themeKey);

  applySavedText();
  applyTheme(themeEdits);
  mountEditor();
  enableTextEditing();

  function readStore(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function applySavedText() {
    editableElements.forEach(function (element) {
      var key = element.dataset.edit;
      if (Object.prototype.hasOwnProperty.call(pageEdits, key)) {
        element.innerHTML = pageEdits[key];
      }
    });
  }

  function applyTheme(themeValues) {
    Object.keys(themeValues).forEach(function (variable) {
      if (themeValues[variable]) {
        document.documentElement.style.setProperty(variable, themeValues[variable]);
      }
    });
  }

  function enableTextEditing() {
    editableElements.forEach(function (element) {
      var key = element.dataset.edit;

      element.contentEditable = "true";
      element.spellcheck = true;
      element.classList.add("live-editable");

      element.addEventListener("input", function () {
        pageEdits[key] = element.innerHTML;
        writeStore(pageKey, pageEdits);
        setStatus("Saved page copy for " + pageId + ".");
      });

      element.addEventListener("focus", function () {
        setStatus("Editing text. Changes auto-save in this browser.");
      });
    });
  }

  function mountEditor() {
    var panel = document.createElement("details");
    panel.className = "editor-panel";
    panel.open = true;

    panel.innerHTML =
      '<summary>Edit Mode</summary>' +
      '<p class="editor-copy">Click any blue-underlined text to change copy. Colors below update live and save in this browser.</p>' +
      '<p class="editor-copy">Permanent files: <code>editable-home.html</code>, <code>editable-dashboard.html</code>, <code>editable-practice.html</code>, and <code>editable-mockup.css</code>.</p>' +
      '<div class="editor-grid">' +
      themeFields
        .map(function (field) {
          return (
            '<label class="editor-field">' +
            "<span>" +
            field.label +
            "</span>" +
            '<input type="color" data-theme-var="' +
            field.variable +
            '" value="' +
            safeColorValue(field.variable, field.fallback) +
            '" />' +
            "</label>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="editor-actions">' +
      '<button type="button" class="editor-button" data-action="copy-theme">Copy theme CSS</button>' +
      '<button type="button" class="editor-button" data-action="download">Download edits JSON</button>' +
      '<button type="button" class="editor-button editor-button-muted" data-action="reset-page">Reset this page</button>' +
      '<button type="button" class="editor-button editor-button-muted" data-action="reset-all">Reset all browser edits</button>' +
      "</div>" +
      '<div class="editor-status" data-status>Edits auto-save in this browser.</div>';

    document.body.appendChild(panel);

    Array.prototype.slice
      .call(panel.querySelectorAll("[data-theme-var]"))
      .forEach(function (input) {
        var variable = input.dataset.themeVar;

        input.addEventListener("input", function () {
          themeEdits[variable] = input.value;
          document.documentElement.style.setProperty(variable, input.value);
          writeStore(themeKey, themeEdits);
          setStatus("Theme updated.");
        });
      });

    panel
      .querySelector('[data-action="copy-theme"]')
      .addEventListener("click", function () {
        var cssText = buildThemeCss();

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(cssText)
            .then(function () {
              setStatus("Theme CSS copied. Paste it into editable-mockup.css.");
            })
            .catch(function () {
              downloadFile("sauce-theme.css", cssText, "text/css");
              setStatus("Clipboard blocked. Downloaded sauce-theme.css instead.");
            });
        } else {
          downloadFile("sauce-theme.css", cssText, "text/css");
          setStatus("Downloaded sauce-theme.css.");
        }
      });

    panel
      .querySelector('[data-action="download"]')
      .addEventListener("click", function () {
        var payload = {
          exportedAt: new Date().toISOString(),
          theme: readStore(themeKey),
          pages: collectAllPages(),
        };

        downloadFile(
          "sauce-mockup-edits.json",
          JSON.stringify(payload, null, 2),
          "application/json"
        );
        setStatus("Downloaded sauce-mockup-edits.json.");
      });

    panel
      .querySelector('[data-action="reset-page"]')
      .addEventListener("click", function () {
        localStorage.removeItem(pageKey);
        location.reload();
      });

    panel
      .querySelector('[data-action="reset-all"]')
      .addEventListener("click", function () {
        localStorage.removeItem(themeKey);

        Object.keys(localStorage).forEach(function (key) {
          if (key.indexOf(textPrefix) === 0) {
            localStorage.removeItem(key);
          }
        });

        location.reload();
      });
  }

  function safeColorValue(variable, fallback) {
    return toHex(themeEdits[variable] || readCssVariable(variable) || fallback);
  }

  function readCssVariable(variable) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }

  function toHex(colorValue) {
    var value = (colorValue || "").trim();

    if (/^#[0-9a-f]{6}$/i.test(value)) {
      return value;
    }

    if (/^#[0-9a-f]{3}$/i.test(value)) {
      return (
        "#" +
        value[1] +
        value[1] +
        value[2] +
        value[2] +
        value[3] +
        value[3]
      );
    }

    var rgbMatch = value.match(
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i
    );

    if (!rgbMatch) {
      return "#3f74f8";
    }

    return (
      "#" +
      [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
        .map(function (channel) {
          var hex = Number(channel).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  function buildThemeCss() {
    return (
      ":root {\n" +
      themeFields
        .map(function (field) {
          var value = readStore(themeKey)[field.variable] || readCssVariable(field.variable);
          return "  " + field.variable + ": " + value + ";";
        })
        .join("\n") +
      "\n}\n"
    );
  }

  function collectAllPages() {
    var pages = {};

    Object.keys(localStorage).forEach(function (key) {
      if (key.indexOf(textPrefix) === 0) {
        pages[key.slice(textPrefix.length)] = readStore(key);
      }
    });

    return pages;
  }

  function downloadFile(filename, content, type) {
    var link = document.createElement("a");
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    link.click();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function setStatus(message) {
    var status = document.querySelector("[data-status]");

    if (status) {
      status.textContent = message;
    }
  }
})();
