const fs = require("fs");
const path = require("path");

const inputPath =
  process.argv[2] || "guest-list-template.csv";

const baseUrlArg =
  process.argv.find((arg) => arg.startsWith("--base="));

const baseUrl =
  baseUrlArg ? baseUrlArg.replace("--base=", "").replace(/\/?$/, "/") : "";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(cell.trim());

      if (row.some(Boolean)) {
        rows.push(row);
      }

      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());

  if (row.some(Boolean)) {
    rows.push(row);
  }

  return rows;
}

function normalizeKey(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const csv =
  fs.readFileSync(inputPath, "utf8");

const [headers, ...rows] =
  parseCsv(csv);

const headerIndex =
  Object.fromEntries(headers.map((header, index) => [header.trim().toLowerCase(), index]));

const guests = {};
const links = [["guest_key", "name", "max_guests", "invite_link"]];

for (const row of rows) {
  const name =
    row[headerIndex.name] || "";

  if (!name) {
    continue;
  }

  const key =
    normalizeKey(row[headerIndex.guest_key] || name);

  const maxGuests =
    Number.parseInt(row[headerIndex.max_guests], 10) || 1;

  guests[key] = {
    name,
    maxGuests
  };

  links.push([
    key,
    name,
    maxGuests,
    baseUrl ? `${baseUrl}?guest=${encodeURIComponent(key)}` : `index.html?guest=${encodeURIComponent(key)}`
  ]);
}

fs.writeFileSync(
  path.join(process.cwd(), "guests.json"),
  `${JSON.stringify(guests, null, 2)}\n`
);

fs.writeFileSync(
  path.join(process.cwd(), "guest-links.csv"),
  `${links.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")}\n`
);

console.log(`Created guests.json and guest-links.csv for ${Object.keys(guests).length} guests.`);
