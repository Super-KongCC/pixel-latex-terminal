

import { LatexSymbol, TutorialLevel, Snippet } from './types';

export const ASCII_SCOTT = `
  ██████  ██████  ██████  ████████ ████████
 ██       ██      ██    ██    ██       ██   
 ██████   ██      ██    ██    ██       ██   
      ██  ██      ██    ██    ██       ██   
 ██████   ██████  ██████      ██       ██   
`;

export const LATEX_SYMBOLS: LatexSymbol[] = [
  {
    category: "Structure",
    items: [
      { label: "Frac", code: "\\frac{a}{b}" },
      { label: "Sup", code: "x^{2}" },
      { label: "Sub", code: "x_{i}" },
      { label: "Text", code: "\\text{Hi}" },
      { label: "Space", code: "\\quad" },
      { label: "Big( )", code: "\\left( \\frac{a}{b} \\right)" },
    ]
  },
  {
    category: "Calculus",
    items: [
      { label: "∫", code: "\\int" },
      { label: "∫ab", code: "\\int_{a}^{b}" },
      { label: "∮", code: "\\oint" },
      { label: "∑", code: "\\sum_{i=0}^{n}" },
      { label: "∏", code: "\\prod_{i=1}^{n}" },
      { label: "lim", code: "\\lim_{x \\to \\infty}" },
      { label: "∂", code: "\\partial" },
      { label: "∇", code: "\\nabla" },
      { label: "dx", code: "\\mathrm{d}x" },
      { label: "Prime", code: "f'(x)" },
    ]
  },
  {
    category: "Greek",
    items: [
      { label: "α", code: "\\alpha" },
      { label: "β", code: "\\beta" },
      { label: "γ", code: "\\gamma" },
      { label: "δ", code: "\\delta" },
      { label: "ε", code: "\\epsilon" },
      { label: "θ", code: "\\theta" },
      { label: "λ", code: "\\lambda" },
      { label: "μ", code: "\\mu" },
      { label: "π", code: "\\pi" },
      { label: "ρ", code: "\\rho" },
      { label: "σ", code: "\\sigma" },
      { label: "φ", code: "\\phi" },
      { label: "ω", code: "\\omega" },
      { label: "Δ", code: "\\Delta" },
      { label: "Ω", code: "\\Omega" },
    ]
  },
  {
    category: "Operators",
    items: [
      { label: "±", code: "\\pm" },
      { label: "×", code: "\\times" },
      { label: "÷", code: "\\div" },
      { label: "·", code: "\\cdot" },
      { label: "√", code: "\\sqrt{x}" },
      { label: "n√", code: "\\sqrt[n]{x}" },
      { label: "∞", code: "\\infty" },
      { label: "∘", code: "\\circ" },
    ]
  },
  {
    category: "Relations",
    items: [
      { label: "=", code: "=" },
      { label: "≠", code: "\\neq" },
      { label: "≈", code: "\\approx" },
      { label: "≡", code: "\\equiv" },
      { label: "≤", code: "\\leq" },
      { label: "≥", code: "\\geq" },
      { label: "≪", code: "\\ll" },
      { label: "≫", code: "\\gg" },
      { label: "∝", code: "\\propto" },
    ]
  },
  {
    category: "Logic & Sets",
    items: [
      { label: "∀", code: "\\forall" },
      { label: "∃", code: "\\exists" },
      { label: "∈", code: "\\in" },
      { label: "∉", code: "\\notin" },
      { label: "⊂", code: "\\subset" },
      { label: "∪", code: "\\cup" },
      { label: "∩", code: "\\cap" },
      { label: "∅", code: "\\emptyset" },
      { label: "⇒", code: "\\Rightarrow" },
      { label: "⇔", code: "\\Leftrightarrow" },
      { label: "∵", code: "\\because" },
      { label: "∴", code: "\\therefore" },
      { label: "ℝ", code: "\\mathbb{R}" },
      { label: "ℤ", code: "\\mathbb{Z}" },
    ]
  },
  {
    category: "Arrows",
    items: [
      { label: "→", code: "\\rightarrow" },
      { label: "←", code: "\\leftarrow" },
      { label: "↔", code: "\\leftrightarrow" },
      { label: "↑", code: "\\uparrow" },
      { label: "↓", code: "\\downarrow" },
      { label: "⟹", code: "\\Longrightarrow" },
      { label: "↦", code: "\\mapsto" },
    ]
  },
  {
    category: "Environments",
    items: [
      { label: "Eq (No #)", code: "\\begin{equation*}\n  E = mc^2\n\\end{equation*}" },
      { label: "Eq (Num)", code: "\\begin{equation}\n  E = mc^2\n\\end{equation}" },
      { label: "Align*", code: "\\begin{align*}\n  x &= 2 \\\\\n  y &= 4\n\\end{align*}" },
      { label: "Cases", code: "\\begin{cases}\n  x & x > 0 \\\\\n  -x & x \\le 0\n\\end{cases}" },
      { label: "Matrix", code: "\\begin{bmatrix}\n  a & b \\\\\n  c & d\n\\end{bmatrix}" },
      { label: "Gather", code: "\\begin{gather}\n  a = b \\\\\n  c = d\n\\end{gather}" },
    ]
  }
];

export const EDITOR_SNIPPETS: Snippet[] = [
  {
    trigger: "\\beg", 
    label: "Equation Env (Unnumbered)",
    insert: "\\begin{equation*}\n  \n\\end{equation*}",
    cursorOffset: -15
  },
  {
    trigger: "\\begin",
    label: "Equation Env",
    insert: "\\begin{equation}\n  \n\\end{equation}",
    cursorOffset: -14 
  },
  {
    trigger: "\\ali",
    label: "Align Env",
    insert: "\\begin{align}\n  \n\\end{align}",
    cursorOffset: -12
  },
  {
    trigger: "\\ali*",
    label: "Align* Env",
    insert: "\\begin{align*}\n  \n\\end{align*}",
    cursorOffset: -13
  },
  {
    trigger: "\\mat",
    label: "Matrix",
    insert: "\\begin{bmatrix}\n  \n\\end{bmatrix}",
    cursorOffset: -14
  },
  {
    trigger: "\\cas",
    label: "Cases",
    insert: "\\begin{cases}\n  \n\\end{cases}",
    cursorOffset: -12
  },
  {
    trigger: "\\frac",
    label: "Fraction",
    insert: "\\frac{}{}",
    cursorOffset: -3
  },
  {
    trigger: "\\sum",
    label: "Summation",
    insert: "\\sum_{}^{}",
    cursorOffset: -4
  },
  {
    trigger: "\\part",
    label: "Partial",
    insert: "\\partial",
    cursorOffset: 0
  },
  {
    trigger: "\\inf",
    label: "Infinity",
    insert: "\\infty",
    cursorOffset: 0
  },
  {
    trigger: "\\to",
    label: "Right Arrow",
    insert: "\\rightarrow",
    cursorOffset: 0
  },
  {
    trigger: "\\arr",
    label: "Right Arrow",
    insert: "\\rightarrow",
    cursorOffset: 0
  },
  {
    trigger: "\\lam",
    label: "Lambda",
    insert: "\\lambda",
    cursorOffset: 0
  }
];

// Structured as: Odd levels teach a command, Even levels test a variation
export const TUTORIAL_LEVELS: TutorialLevel[] = [
  // --- PAIR 1: Greek Letters ---
  {
    id: 1,
    taskEn: "TEACHING: To type Greek letters, use a backslash. Try typing exactly: \\alpha",
    taskZh: "【教学】输入希腊字母需要用反斜杠。请完全照着输入：\\alpha",
    expected: ["\\alpha"],
    hintEn: "Type exactly: \\alpha",
    hintZh: "输入：\\alpha"
  },
  {
    id: 2,
    taskEn: "PRACTICE: Now, try to type the Greek letter Beta.",
    taskZh: "【练习】学会了吗？现在试着输入希腊字母 Beta。",
    expected: ["\\beta"],
    hintEn: "Follow the pattern: \\beta",
    hintZh: "照猫画虎：\\beta"
  },

  // --- PAIR 2: Superscripts ---
  {
    id: 3,
    taskEn: "TEACHING: For superscripts (powers), use the caret (^). Type: x^2",
    taskZh: "【教学】上标（次方）使用脱字符 (^)。请完全照着输入：x^2",
    expected: ["x^2", "x^{2}"],
    hintEn: "Type exactly: x^2",
    hintZh: "输入：x^2"
  },
  {
    id: 4,
    taskEn: "PRACTICE: Now type y to the power of 5.",
    taskZh: "【练习】举一反三，输入 y 的 5 次方。",
    expected: ["y^5", "y^{5}"],
    hintEn: "y^5",
    hintZh: "y^5"
  },

  // --- PAIR 3: Subscripts ---
  {
    id: 5,
    taskEn: "TEACHING: For subscripts (indices), use the underscore (_). Type: a_1",
    taskZh: "【教学】下标使用下划线 (_)。请完全照着输入：a_1",
    expected: ["a_1", "a_{1}"],
    hintEn: "Type exactly: a_1",
    hintZh: "输入：a_1"
  },
  {
    id: 6,
    taskEn: "PRACTICE: Now type x sub 99 (remember to group 99 with curly braces!).",
    taskZh: "【练习】输入 x 下标 99（提示：多个字符要用花括号 {} 包起来！）。",
    expected: ["x_{99}"],
    hintEn: "x_{99}",
    hintZh: "x_{99}"
  },

  // --- PAIR 4: Fractions ---
  {
    id: 7,
    taskEn: "TEACHING: Fractions use \\frac{num}{den}. Type: \\frac{1}{2}",
    taskZh: "【教学】分数使用 \\frac{分子}{分母}。请完全照着输入：\\frac{1}{2}",
    expected: ["\\frac{1}{2}", "\\frac12"],
    hintEn: "Type exactly: \\frac{1}{2}",
    hintZh: "输入：\\frac{1}{2}"
  },
  {
    id: 8,
    taskEn: "PRACTICE: Create a fraction with 'a' on top and 'b' on bottom.",
    taskZh: "【练习】创建一个分数，分子是 a，分母是 b。",
    expected: ["\\frac{a}{b}", "\\fracab"],
    hintEn: "\\frac{a}{b}",
    hintZh: "\\frac{a}{b}"
  },

  // --- PAIR 5: Roots ---
  {
    id: 9,
    taskEn: "TEACHING: Square roots use \\sqrt{...}. Type: \\sqrt{x}",
    taskZh: "【教学】平方根使用 \\sqrt{...}。请完全照着输入：\\sqrt{x}",
    expected: ["\\sqrt{x}", "\\sqrtx"],
    hintEn: "Type exactly: \\sqrt{x}",
    hintZh: "输入：\\sqrt{x}"
  },
  {
    id: 10,
    taskEn: "FINAL EXAM: Type the square root of abc.",
    taskZh: "【期末考】输入 abc 的平方根。",
    expected: ["\\sqrt{abc}"],
    hintEn: "Put abc inside the braces: \\sqrt{abc}",
    hintZh: "把 abc 放进花括号里：\\sqrt{abc}"
  }
];

export const GAME_TEXT = {
  en: {
    welcome: "ENTERING TEACHING MODE...",
    intro: "I am Professor Scott. I will show you the Way of LaTeX.\nRule: I teach one concept, you practice it immediately.",
    start: "Let's begin!",
    correct: ["CORRECT! Next...", "GOOD JOB! Moving on...", "PRECISELY!", "YOU LEARN FAST!"],
    wrong: ["Not quite.", "Check the syntax.", "Look at the example again."],
    win: "CLASS DISMISSED! You have graduated from Basic LaTeX.",
    score: "Final Score"
  },
  zh: {
    welcome: "正在进入教学模式...",
    intro: "我是 Scott 教授。带你领略 LaTeX 之道。\n规则：我教一个概念，你马上练习。",
    start: "开始吧！",
    correct: ["正确！下一题...", "干得好！继续...", "完全正确！", "你学得很快！"],
    wrong: ["不对哦。", "检查一下语法。", "再看看示例代码。"],
    win: "下课！恭喜你从 LaTeX 基础班毕业。",
    score: "最终得分"
  }
};

export const UI_TEXT = {
  en: {
    welcome: "PixelLatex Terminal [Version 1.0.4]",
    lastLogin: "Last login",
    helpCmd: "Type -h for help",
    symbolCmd: "Type -hn for symbols",
    navHint: "Use Up/Down arrows to navigate history",
    processing: "PROCESSING...",
    download: "DOWNLOAD",
    copy: "COPY IMG",
    waiting: "Waiting for input...",
    engineReady: "LATEX ENGINE: READY",
    roasts: [
      "You should open latexlive.com for some dummy tutorials.",
      "Are you meditating or just forgot how to type \\alpha?",
      "I've seen glaciers move faster than this.",
      "Hello? Is anybody in there?",
      "Latex isn't that hard, just type *something*.",
      "My CPU cycles are being wasted on this silence.",
      "Error 404: User motivation not found.",
      "Please feed me some curly braces.",
      "I'm dreaming of electric sheep... and \\sum formulas.",
      "Type something, I dare you."
    ]
  },
  zh: {
    welcome: "PixelLatex 终端 [版本 1.0.4]",
    lastLogin: "上次登录",
    helpCmd: "输入 -h 查看帮助",
    symbolCmd: "输入 -hn 查看符号表",
    navHint: "使用上下箭头键翻阅历史",
    processing: "处理中...",
    download: "下载图片",
    copy: "复制图片",
    waiting: "等待输入...",
    engineReady: "LATEX 引擎: 就绪",
    roasts: [
      "你应该打开 latexlive.com 来点傻瓜教程。",
      "你在发呆吗？我的像素都快掉色了。",
      "嘿，键盘上那个大的键叫回车，试试看？",
      "沉默是金，但在这里沉默是 0 bytes。",
      "你是忘记了公式怎么写，还是在冥想？",
      "我的 CPU 在空转，你的大脑也是吗？",
      "给点括号吧，求你了。",
      "我梦见电子羊在吃 \\sum 公式。",
      "能不能快点？我等到花儿都谢了。",
      "输入点什么吧，我敢打赌你不会。"
    ]
  }
};

export const HELP_TEXT = `
PIXEL LATEX TERMINAL v1.0.4
===========================

USAGE:
  Type LaTeX syntax and press [Enter] to render.
  Press [Shift + Enter] for a new line in the editor.
  
  [TAB] COMPLETION ENABLED:
  \\beg [TAB] -> equation* (unnumbered)
  \\begin [TAB] -> equation (numbered)
  \\ali [TAB] -> align
  \\part [TAB] -> \\partial
  \\inf [TAB] -> \\infty
  ...and many more.

COMMANDS:
  clear          Clear terminal history
  game           Start Tutorial Game
  font <1-5>     Set font size
  switch -mac    Switch to MacOS Style
  switch -win    Switch to Windows 98 Style
  switch -cyber  Switch to Cyberpunk Style
  matrix(R,C)    Generate a matrix with R rows and C columns
                 Example: matrix(2,2)
  -h             Show this help
  -hn            Open symbol GUI (Includes Matrix Tool)
  -download      Download rendered formula
  -copy          Copy rendered formula

EXAMPLES:
  $ \\begin{align*} x &= 1 \\\\ y &= 2 \\end{align*}
  $ matrix(3,3)
  $ switch -win
  $ \\int_{0}^{\\infty} e^{-x^2} dx -download
`;