let selectedLanguage = "java"; // default
const languageSelect = document.getElementById("language-select");

const snippetsByLanguage = {
  java: [],
  python: [],
  cpp: [],
};

// Function to load code snippets from a file
async function loadSnippetsFromFile(language, filename) {
  try {
    const response = await fetch(filename);
    let text = await response.text();

    // Escape backticks and backslashes for string literals
    text = text.replace(/`/g, '\\`').replace(/\\/g, '\\\\');

    // Split into snippets, and wrap each in backticks
    const snippets = text.split('//')
      .filter(snippet => snippet.trim() !== '')
      .map(snippet => `\`${snippet.trim()}\``);

    snippetsByLanguage[language] = snippets;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
  }
}

// Load snippets for Java, Python and C++
Promise.all([
  loadSnippetsFromFile("java", "java_codes.java"),
  loadSnippetsFromFile("python", "python_codes.py"),
  loadSnippetsFromFile("cpp", "cpp_codes.cpp"),
]).then(() => {
  let snippetEditor, typingEditor;
  let currentSnippet = "";
  let timer, timeLeft = 60, testStarted = false;
  let testDuration = "60";

  const timerDisplay = document.getElementById("timer");
  const wpmDisplay = document.getElementById("wpm");
  const accuracyDisplay = document.getElementById("accuracy");
  const themeToggle = document.getElementById("theme-toggle");
  const restartButton = document.getElementById("restart-button");

  function initEditors() {
    let mode;
    if (selectedLanguage === "cpp") {
      mode = "text/x-c++src";
    } else if (selectedLanguage === "java") {
      mode = "text/x-java";
    } else if (selectedLanguage === "python") {
      mode = "text/x-python";
    } else {
      mode = "javascript"; // Default to JavaScript
    }

    snippetEditor = CodeMirror.fromTextArea(document.getElementById("snippet-editor"), {
      mode: mode,
      theme: "eclipse",
      lineNumbers: true,
      readOnly: true,
      lineWrapping: true,
    });

    typingEditor = CodeMirror.fromTextArea(document.getElementById("typing-editor"), {
      mode: mode,
      theme: "eclipse",
      lineNumbers: true,
      lineWrapping: true,
    });

    typingEditor.on("change", handleTyping);
  }

  function normalizeText(text) {
    return text.split("\n").map(line => line.trim()).join("\n");
  }

  function updateStats(typedText) {
    const normalizedSnippet = normalizeText(currentSnippet);
    let correctChars = typedText.split("").filter((char, idx) => char === normalizedSnippet[idx]).length;
    let elapsedMinutes;
    if (testDuration !== "unlimited") {
      elapsedMinutes = (parseInt(testDuration) - timeLeft) / 60;
    } else {
      elapsedMinutes = (testStarted ? (new Date() - startTime) / 60000 : 1 / 60);
    }
    let wpm = Math.round((correctChars / 5) / (elapsedMinutes || (1 / 60)));
    let accuracy = Math.round((correctChars / (typedText.length || 1)) * 100);

    wpmDisplay.textContent = wpm || "0";
    accuracyDisplay.textContent = accuracy || "0";
  }

  function highlightMistakesInSnippet(typedText) {
    const normalizedSnippet = normalizeText(currentSnippet);
    snippetEditor.operation(() => {
      snippetEditor.getDoc().setValue(normalizedSnippet);
      for (let i = 0; i < typedText.length; i++) {
        let expectedChar = normalizedSnippet[i];
        let actualChar = typedText[i];
        let fromPos = snippetEditor.posFromIndex(i);
        let toPos = snippetEditor.posFromIndex(i + 1);
        if (actualChar === expectedChar) {
          snippetEditor.markText(fromPos, toPos, { className: "cm-correct" });
        } else {
          snippetEditor.markText(fromPos, toPos, { className: "cm-incorrect" });
        }
      }
    });
  }

  let startTime = null;

  function handleTyping() {
    if (!testStarted) {
      startTest();
      testStarted = true;
      if (testDuration === "unlimited") {
        startTime = new Date();
      }
    }

    const typedText = normalizeText(typingEditor.getValue());
    updateStats(typedText);
    highlightMistakesInSnippet(typedText);

    const normalizedSnippet = normalizeText(currentSnippet);
    if (typedText === normalizedSnippet) {
      endTest();
      return;
    }

    const snippetLines = normalizedSnippet.split("\n");
    const userLines = typingEditor.getValue().split("\n").map(line => line.trim());
    if (userLines.length >= snippetLines.length && userLines[snippetLines.length - 1].length >= snippetLines[snippetLines.length - 1].length) {
      endTest();
    }
  }

  function startTest() {
    if (testDuration !== "unlimited") {
      timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) endTest();
      }, 1000);
    }
  }

  function endTest() {
    clearInterval(timer);
    typingEditor.setOption("readOnly", true);
    localStorage.setItem("wpm", wpmDisplay.textContent);
    localStorage.setItem("accuracy", accuracyDisplay.textContent);
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dracula" : "eclipse");
    localStorage.setItem("duration", testDuration);
    window.location.href = "results.html";

    const duration = 60;
    const testID = 1;
    const wpm = parseFloat(wpmDisplay.textContent);
    const accuracy = parseFloat(accuracyDisplay.textContent);

    axios.post('http://localhost:3000/typing-test/start', {
      testID,
      accuracy,
      words_per_minute: wpm,
      time_taken: duration
    }).then(response => {
      console.log("Result saved to DB:", response.data);
    }).catch(error => {
      console.error("Error saving result:", error);
    });
  }

  restartButton.onclick = () => {
    const durationSelect = document.getElementById("duration-select");
    if (durationSelect) {
      testDuration = durationSelect.value;
    }
    if (testDuration !== "unlimited") {
      timeLeft = parseInt(testDuration);
      timerDisplay.textContent = timeLeft;
    } else {
      timerDisplay.textContent = "Unlimited";
    }

    typingEditor.setValue("");
    typingEditor.setOption("readOnly", false);
    clearInterval(timer);
    testStarted = false;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    startTime = null;

    const langSnippets = snippetsByLanguage[selectedLanguage] || [];
    currentSnippet = langSnippets[Math.floor(Math.random() * langSnippets.length)];

    snippetEditor.setValue(currentSnippet);
  };

  themeToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
    let theme = document.body.classList.contains("dark-mode") ? "dracula" : "eclipse";
    snippetEditor.setOption("theme", theme);
    typingEditor.setOption("theme", theme);
    localStorage.setItem("theme", theme);
  };

  window.onload = () => {
    let savedTheme = localStorage.getItem("theme") || "eclipse";
    if (savedTheme === "dracula") {
      document.body.classList.add("dark-mode");
    }

    const durationSelect = document.getElementById("duration-select");
    if (durationSelect) {
      let storedDuration = localStorage.getItem("selectedDuration");
      if (storedDuration) {
        durationSelect.value = storedDuration;
        testDuration = storedDuration;
      } else {
        testDuration = durationSelect.value;
      }
      if (testDuration !== "unlimited") {
        timeLeft = parseInt(testDuration);
        timerDisplay.textContent = timeLeft;
      } else {
        timerDisplay.textContent = "Unlimited";
      }
      durationSelect.addEventListener("change", function () {
        localStorage.setItem("selectedDuration", this.value);
        window.location.reload();
      });
    }
    const storedLang = localStorage.getItem("selectedLanguage");
    if (storedLang) {
      selectedLanguage = storedLang;
      languageSelect.value = storedLang;
    }

    languageSelect.addEventListener("change", function () {
      selectedLanguage = this.value;
      localStorage.setItem("selectedLanguage", selectedLanguage);
      window.location.reload();
    });

    const langSnippets = snippetsByLanguage[selectedLanguage] || [];
    currentSnippet = langSnippets[Math.floor(Math.random() * langSnippets.length)];

    initEditors();
    snippetEditor.setOption("theme", savedTheme);
    typingEditor.setOption("theme", savedTheme);
    snippetEditor.setValue(currentSnippet);
  };

  const exitButton = document.getElementById("exit-button");

  exitButton.onclick = () => {
    clearInterval(timer);
    const confirmExit = confirm("Are you sure you want to quit the test?");
    if (confirmExit) {
      window.location.href = "http://localhost:3000/home";
    } else {
      if (testDuration !== "unlimited") {
        timer = setInterval(() => {
          timeLeft--;
          timerDisplay.textContent = timeLeft;
          if (timeLeft <= 0) endTest();
        }, 1000);
      }
    }
  };
});