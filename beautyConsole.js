
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


/**
 * 
 * @param {string[][]} mat 
 * @param {{
    outerBox: boolean;
    separatorHeader: boolean;
    separatorAll: boolean;
  }} options 
 * @returns 
 */
function createAsciiTable(mat,options,borders){
  const OPT={
    outerBox:false,
    separatorHeader:true,
    separatorAll:false,
    paddingH:0,
    paddingV:0,
    headerColor:undefined,
    cellColor:undefined,
    borderColor:undefined,
    autoConsoleLog:true,
    ...options
  }
  let result = ""
  const BORDERS={
    tl:"╔",
    tc:"╦",
    tr:"╗",
    cl:"╠",
    cc:"╬",
    cr:"╣",
    bl:"╚",
    bc:"╩",
    br:"╝",
    v:"║",
    h:"═",
    ...borders
  }


  if (OPT.borderColor) {
    for (const key in BORDERS) {
      BORDERS[key] = c(OPT.borderColor,BORDERS[key]);
    }
  }

  const padh = " ".repeat(OPT.paddingH)

  if (mat.length === 0) return
  if(!mat.every(line=>Array.isArray(line))) return

  const maxLineLength = mat.reduce((acc,v)=>Math.max(acc,v.length),0)

  const columLengths = Array.from({length:maxLineLength}).fill(0)

  for(let i=0;i<mat.length;i++){ //fila 
    for(let j=0;j<mat[i].length;j++){//columna
      const str = mat[i][j]
      if(columLengths[j] < str.length){
        columLengths[j] = str.length
      }
    }
  }

  const getLineSeparator = (cl=BORDERS.cl,cc=BORDERS.cc,cr=BORDERS.cr)=> {
    const l = OPT.outerBox?cl:""
    const r = OPT.outerBox?cr:""
    return l + columLengths.map(x=>BORDERS.h.repeat(x + OPT.paddingH*2)).join(cc) + r
  }

  //PRINT THE TABLE

  //outerbox top line
  if(OPT.outerBox){
    result+=getLineSeparator(BORDERS.tl,BORDERS.tc,BORDERS.tr) + "\n"
  }

  for(let i=0;i<mat.length;i++){ //fila 

    //outerbox left
    if(OPT.outerBox){
      result+=BORDERS.v
    }

    for(let j=0;j<mat[i].length;j++){//columna
      const str = mat[i][j]
      const endPad = columLengths[j] - str.length
      
      //cell
      let content = padh + str + " ".repeat(endPad) + padh
      if(i===0 && OPT.headerColor){
        content = c(OPT.headerColor,content)
      }else if(OPT.cellColor){
        content = c(OPT.cellColor,content)
      } 
      result += content

      //cell separator
      if(j<mat[i].length-1){
        result += BORDERS.v
      }

    }

    //outerbox right
    if(OPT.outerBox){
      result+=BORDERS.v
    }

    //line separator
    if(
      (i<mat.length-1 && OPT.separatorAll) ||  //separator between all lines
      (i===0 && OPT.separatorHeader && mat.length>1)  //separator only for header
    ){
      result += "\n" + getLineSeparator()
    }

    //line break
    result+="\n"
  }

  //outerbox bottom
  if(OPT.outerBox){
    result+=getLineSeparator(BORDERS.bl,BORDERS.bc,BORDERS.br)
  }


  if(OPT.autoConsoleLog){
    console.log(result)
  }
  return result
}



