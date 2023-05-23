
function c(color, text = "") {
  const colors = {
    reset: "\x1b[0m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  };

  if (text === "") {
    return colors[color]
  }

  const prefix = colors[color] || colors.reset;
  const suffix = colors.reset;

  return `${prefix}${text}${suffix}`;
}



function title() {
  let text = "", length = 70, spacer = "-"
  if (arguments.length == 1) {
    if (typeof (arguments[0]) == "string") {
      [text] = arguments
    } else {
      [length] = arguments
    }
  } else if (arguments.length == 2) {
    [text, length] = arguments
  }

  const spacerCount = Math.ceil(length / spacer.length);
  const line = spacer.repeat(spacerCount)


  const l = length
  const w = text.length
  const x = (Math.floor(l - w) / 2)

  text = text.split("").map((c, i) => (c == " " ? line[i] : c)).join("")

  return line.slice(0, x) + text + line.slice(x + w, l);
}


function createAsciiBox(lines, leftPadding = 0, color = "reset") {

  const maxLength = lines.reduce((acc, v) => Math.max(acc, v.length), 0)

  const leftSpaces = " ".repeat(leftPadding)
  const topBorder = leftSpaces + c(color) + '╔' + '═'.repeat(maxLength + -3) + '╗' + c("reset");
  const bottomBorder = leftSpaces + c(color) + '╚' + '═'.repeat(maxLength + -3) + '╝' + c("reset");

  const content = lines.map((line) => {
    const padding = ' '.repeat(maxLength - line.length);
    const newLine = `${leftSpaces}${c(color, '║')} ${line}${c("reset")}${padding} ${c(color, '║')}`;
    return newLine
  });

  return [topBorder, ...content, bottomBorder].join('\n');
}



module.exports = {
  title,
  c,
  createAsciiBox
}


