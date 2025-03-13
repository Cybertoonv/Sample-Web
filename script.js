// Global colors in ANSI escape codes
const colors = {
  reset: "\x1b[0m",
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  Boldyellow: "\x1b[1;33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[1;37m",
  purple: "\x1b[1;35m",
  brightBlack: "\x1b[90m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};
// Color effect
// FEEL FREE TO CHANGE THEM
let tag = colors.blue;
let d_tag = colors.yellow;
let t_tag = colors.red;
let bullet = colors.brightGreen;
let highlight = colors.bgBlack;
let primary =colors.yellow;
let secondary = colors.brightMagenta;
let link= colors.purple
let whoami= colors.Boldyellow
let whoamiinfo= colors.white
let neofetch= colors.blue


// Initialize the terminal
const term = new Terminal({
  scrollbar: true,
  cursorBlink: true,
  theme: {
    background: "transparent",
    foreground: "#fff",// FEEL FREE TO CHANGE THEM
    cursor: "#58a6ff",// FEEL FREE TO CHANGE THEM
  },
});

// Load the fit addon for responsiveness
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

// Open the terminal in the container and apply initial fit
term.open(document.getElementById("terminal-container"));
fitAddon.fit();

// Adjust terminal size on window resize
window.addEventListener("resize", () => {
  fitAddon.fit();
});

// Function to display the startup ASCII art message
//Startup Message
function displayStartupMessage() {
  const art = `${colors.brightCyan}
Welcome to my Portfolio Website\n\r
Use ls to check available files and read them using cat\n\r
Example: ${colors.brightWhite}${colors.bgBlack}cat aboutme.txt\n\r
${colors.reset}`;
  term.write(art);
}


function prompt() {
  term.write("┌──(Kali_Linux㉿kali)-[~]\r\n");
  term.write("└─$ ");
}

// Display startup message then prompt
displayStartupMessage();

async function listFiles() {
  try {
    const response = await fetch("files.json");
    if (!response.ok) throw new Error("Failed to load files");
    const data = await response.json();
    return data.files;
  } catch (error) {
    return [];
  }
}
//COPY AND PASTE
// Attach a custom key event handler to intercept Ctrl+C
term.attachCustomKeyEventHandler((e) => {
// Check if Ctrl+C was pressed
if (e.ctrlKey && e.key === 'c') {
// Get the current selection from the terminal
const selectedText = term.getSelection();
if (selectedText) {
  // Use the Clipboard API to copy the selected text
  navigator.clipboard.writeText(selectedText)
    .then(() => console.log("Copied to clipboard"))
    .catch((err) => console.error("Copy failed", err));
}
// Return false to prevent the default behavior (sending SIGINT)
return false;
}
// For all other keys, use the default behavior
return true;
});


async function fetchFileContent(filename) {
  try {
    const response = await fetch(`files/${filename}`);
    if (!response.ok) throw new Error("File not found");
    const text = await response.text();
    return formatText(text);
  } catch (error) {
    return `\x1b[1;31mError: ${error.message}\x1b[0m\r\n`; // Error message should always be in red btw [1; is to bold it
  }
}
function formatText(text) {
  return text
    .split("\n")
    .map((line) => {
      if (line.startsWith("###")) {
        return `${t_tag}${line.replace("###", "").trim()}${colors.reset}\r\n`;
      } else if (line.startsWith("##")) {
        return `${d_tag}${line.replace("##", "").trim()}${colors.reset}\r\n`;
      } else if (line.startsWith("#")) {
        return `${tag}${line.replace("#", "").trim()}${colors.reset}\r\n`;
      } else if (line.startsWith("*)")) {
        return `${bullet} • ${line.replace("*)", "").trim()}${colors.reset}\r\n`;
      } else {
        return `\x1b[37m${line
          .replace(/\*\*(.*?)\*\*/g, "\x1b[1m$1\x1b[22m") //bold
          .replace(/\*(.*?)\*/g, "\x1b[3m$1\x1b[23m") //italic
          .replace(/\$(.*?)\$/g, `${highlight}$1${colors.reset}`) // Highlight text enclosed in $ symbols:
          .replace(/"(.*?)"/g, `${primary}$1${colors.reset}`)     // primary (text in double quotes)
          .replace(/`(.*?)`/g, `${secondary}$1${colors.reset}`)   // secondary (text in single quotes)
          .replace(/\[(.*?)\]\((https?:\/\/[^\s]+)\)/g,
            `\x1b]8;;$2\x1b\\${link}$1\x1b[0m\x1b]8;;\x1b\\`
          ) //linked
          }\x1b[0m\r\n`;
      }
    })
    .join("");
}
prompt();
let command = "";
let commandsList = ["ls", "cat", "clear", "whoami", "help"];

term.onData(async (e) => {
  if (e === "\r") {
    // Enter key pressed
    term.write("\r\n");
    const args = command.trim().split(" ");
    if (args[0] === "ls") {
      const fileList = await listFiles();
      let formattedFiles = "";
      for (let i = 0; i < fileList.length; i += 2) {
        if (i + 1 < fileList.length) {
          formattedFiles += ` ${fileList[i]}    ${fileList[i + 1]}\r\n`;
        } else {
          formattedFiles += ` ${fileList[i]}\n\r`;
        }
      }
      term.write(formattedFiles);
      term.write("\n");
    } else if (args[0] === "cat" && args[1]) {
      const content = await fetchFileContent(args[1]);
      term.write(content);
    } else if (args[0] === "clear") {
      term.clear();
    } else if (args[0] === "whoami") {
      term.write(`${whoami}Nobody${colors.reset}\r\n`);
      term.write(`${whoamiinfo}Cybersecurity Student | Soc Analyst | SIEM Engineer${colors.reset}\r\n`);
    } else if (args[0] === "neofetch") {
      term.write(`${neofetch}.-------------------------------.\r\n`);
      term.write(`|        Add a name             |\r\n`);
      term.write(`|-------------------------------|\r\n`);
      term.write(`| Cybersecurity Student         |\r\n`);
      term.write(`| Senior SOC Analyst            |\r\n`);
      term.write(`| Linux Enthusiast              |\r\n`);
      term.write(`| Web Security & Penetration    |\r\n`);
      term.write(`|-------------------------------|\r\n`);
      term.write(`| Favorite OS: Kali Linux       |\r\n`);
      term.write(`| Tool : Kali Linux             |\r\n`);
      term.write(`| Editor: gedit                 |\r\n`);
      term.write(`| Terminal: Warp                |\r\n`);
      term.write(`| Languages: python, Java       |\r\n`);
      term.write(`|-------------------------------|\r\n`);
      term.write(`| Portfolio: Someones.dev   |\r\n`);
      term.write(`'-------------------------------'\r\n${colors.reset}`);
    } else if (args[0] === "help") {
      term.write(`${whoami}Available commands:${colors.reset}\r\n`);
      term.write("whoami      - Display user information\r\n");
      term.write("ls          - List available files\r\n");
      term.write("cat [file]  - Show file content\r\n");
      term.write("clear       - Clear terminal\r\n");
      term.write("neofetch    - Show's user information\r\n");
      term.write("help        - Show this help menu\r\n");
    }
    prompt();
    command = "";
    term.scrollToBottom();
  } else if (e === "\u007f") {
    // Backspace key pressed
    if (command.length > 0) {
      command = command.slice(0, -1);
      term.write("\b \b");
    }
  } else if (e === "\t") {
    // Tab key for file autocomplete
    if (command.startsWith("cat ")) {
      const partialFile = command.split(" ")[1] || "";
      const fileList = await listFiles();
      const match = fileList.find((file) => file.startsWith(partialFile));
      if (match) {
        term.write(match.slice(partialFile.length));
        command = `cat ${match}`;
      }
    }
  } else {
    command += e;
    term.write(e);
  }
});
