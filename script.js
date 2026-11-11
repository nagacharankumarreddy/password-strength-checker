// Brute-force time estimates, indexed by password length (4-18) and then by character-set group.
const CRACK_TIMES = new Map([
  [18, ["7qd Years", "100 tn Years", "6tn Years", "23m Years", "9 Months"]],
  [17, ["93tn Years", "2tn Years", "100bn Years", "800k Years", "4 Weeks"]],
  [16, ["1tn Years", "37bn Years", "2bn Years", "34k Years", "2 Days"]],
  [15, ["15 bn Years", "600m Years", "43m Years", "1k Years", "6 Hours"]],
  [14, ["200M Years", "9M Years", "800K Years", "51 Years", "41 Min"]],
  [13, ["2M Years", "100K Years", "16K Years", "1 Year", "4 Min"]],
  [12, ["34K Years", "2K Years", "300 Years", "3 Weeks", "25 Sec"]],
  [11, ["400 Years", "41 Years", "5 Years", "1 Day", "2 Sec"]],
  [10, ["5 Years", "7 Months", "1 Month", "58 Mins", "Instantly"]],
  [9, ["3 Weeks", "3 Days", "19 Hours", "2 Mins", "Instantly"]],
  [8, ["8 Hours", "1 Hour", "22 Mins", "5 Secs", "Instantly"]],
  [7, ["6 Mins", "1 Min", "25 Secs", "Instantly", "Instantly"]],
  [6, ["5 Secs", "1 Sec", "Instantly", "Instantly", "Instantly"]],
  [5, ["Instantly", "Instantly", "Instantly", "Instantly", "Instantly"]],
  [4, ["Instantly", "Instantly", "Instantly", "Instantly", "Instantly"]],
]);

const UNITS = ["Instantly", "Sec", "Min", "Hour", "Day", "Week", "Month", "Year"];

// Strength levels, from weakest to strongest.
const LEVELS = [
  { label: "Too Weak", color: "#f43f5e" },
  { label: "Weak", color: "#fb923c" },
  { label: "Medium", color: "#facc15" },
  { label: "Strong", color: "#a3e635" },
  { label: "Excellent", color: "#34d399" },
];

const EMPTY_COLOR = "#475569";

const $input = document.getElementById("pword");
const $toggle = document.getElementById("toggle");
const $status = document.getElementById("status-text");
const $segments = document.getElementById("segments");
const $checks = document.getElementById("checks");
const $submit = document.getElementById("submit");
const $result = document.getElementById("res");
const $resultValue = document.getElementById("res-value");
const $resultNote = document.getElementById("res-note");

const traits = (value) => ({
  length: value.length >= 8,
  lower: /[a-z]/.test(value),
  upper: /[A-Z]/.test(value),
  number: /[0-9]/.test(value),
  symbol: /\W/.test(value),
});

// Index of the character-set group used to look up the estimate (0 = richest mix, 5 = nothing).
function groupOf({ lower, upper, number, symbol }) {
  if (number && symbol && upper && lower) return 0;
  if (number && lower && upper) return 1;
  if ((upper && lower) || (upper && number) || (number && lower)) return 2;
  if (upper || lower) return 3;
  if (number) return 4;
  return 5;
}

const estimate = (value) => {
  const length = Math.min(18, Math.max(4, value.length));
  return CRACK_TIMES.get(length)[groupOf(traits(value))];
};

function levelOf(value) {
  const unit = UNITS.findIndex((u) => estimate(value)?.includes(u));
  if (unit < 2) return 0;
  if (unit < 4) return 1;
  if (unit === 4) return 2;
  if (unit === 5) return 3;
  return 4;
}

function render() {
  const value = $input.value;
  const empty = value.length === 0;
  const level = empty ? -1 : levelOf(value);
  const color = empty ? EMPTY_COLOR : LEVELS[level].color;

  document.documentElement.style.setProperty("--level", color);
  $status.textContent = empty ? "Type a password" : LEVELS[level].label;
  $segments.setAttribute("aria-valuenow", String(level + 1));
  [...$segments.children].forEach((segment, i) => segment.classList.toggle("on", i <= level));

  const found = traits(value);
  $checks.querySelectorAll("li").forEach((item) => item.classList.toggle("ok", found[item.dataset.check]));

  if (empty) $result.hidden = true;
  else if (!$result.hidden) showResult();
}

function showResult() {
  const value = $input.value;
  $resultValue.textContent = estimate(value) || "Instantly";
  $resultNote.textContent = `${value.length} characters · ${LEVELS[levelOf(value)].label.toLowerCase()}`;
  $result.hidden = false;
}

function check() {
  if ($input.value.length === 0) {
    $submit.textContent = "Enter a password first";
    $input.focus();
    return;
  }
  showResult();
}

// With an empty field the button playfully dodges the cursor (pointer devices only).
const canHover = window.matchMedia("(hover: hover)").matches;
let dodge = 1;
function nudgeButton() {
  if (!canHover) return;
  if ($input.value === "") {
    $submit.textContent = "Enter a password";
    $submit.style.transform = `translateX(${dodge * 22}%)`;
    dodge *= -1;
  } else {
    $submit.textContent = "Check";
    $submit.style.transform = "";
  }
}

$input.addEventListener("input", () => {
  if ($submit.textContent !== "Check") $submit.textContent = "Check";
  $submit.style.transform = "";
  render();
});
$input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") check();
});
$submit.addEventListener("click", check);
$submit.addEventListener("mouseenter", nudgeButton);
$toggle.addEventListener("click", () => {
  const show = $input.type === "password";
  $input.type = show ? "text" : "password";
  $toggle.setAttribute("aria-pressed", String(show));
  $toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
  $input.focus();
});

$input.focus();
render();
