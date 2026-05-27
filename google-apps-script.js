const SHEET_NAME = "RSVP";

const HEADERS = [
  "Received At",
  "Submitted At",
  "Guest Key",
  "Guest Name",
  "Guest Count",
  "Notes"
];

function doGet(event) {
  const data =
    event.parameter || {};

  const response =
    data.guestKey
      ? getRsvp(data.guestKey)
      : {
          ok: true,
          message: "RSVP endpoint is running"
        };

  if (data.callback) {
    return ContentService
      .createTextOutput(`${data.callback}(${JSON.stringify(response)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(event) {
  const sheet =
    getSheet();

  ensureHeaders(sheet);

  const data =
    event.parameter || {};

  const rowData = [
    new Date(),
    data.submittedAt || "",
    data.guestKey || "",
    data.guestName || "",
    data.guestCount || "",
    data.notes || ""
  ];

  const existingRow =
    findGuestRow(sheet, data.guestKey);

  if (existingRow) {
    sheet
      .getRange(existingRow, 1, 1, rowData.length)
      .setValues([rowData]);

    removeDuplicateGuestRows(sheet, data.guestKey, existingRow);
  } else {
    sheet.appendRow(rowData);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRsvp(guestKey) {
  const sheet =
    getSheet();

  ensureHeaders(sheet);

  const row =
    findGuestRow(sheet, guestKey);

  if (!row) {
    return {
      ok: true,
      rsvp: null
    };
  }

  const values =
    sheet
      .getRange(row, 1, 1, HEADERS.length)
      .getValues()[0];

  return {
    ok: true,
    rsvp: {
      submittedAt: values[1] || "",
      guestKey: values[2] || "",
      guestName: values[3] || "",
      guestCount: String(values[4] || ""),
      notes: values[5] || ""
    }
  };
}

function getSheet() {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME) ||
    SpreadsheetApp
      .getActiveSpreadsheet()
      .insertSheet(SHEET_NAME);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
}

function findGuestRow(sheet, guestKey) {
  if (!guestKey || sheet.getLastRow() < 2) {
    return null;
  }

  const values =
    sheet
      .getRange(2, 3, sheet.getLastRow() - 1, 1)
      .getValues();

  for (let index = values.length - 1; index >= 0; index--) {
    if (values[index][0] === guestKey) {
      return index + 2;
    }
  }

  return null;
}

function removeDuplicateGuestRows(sheet, guestKey, keepRow) {
  if (!guestKey || sheet.getLastRow() < 2) {
    return;
  }

  const values =
    sheet
      .getRange(2, 3, sheet.getLastRow() - 1, 1)
      .getValues();

  for (let index = values.length - 1; index >= 0; index--) {
    const rowNumber =
      index + 2;

    if (rowNumber !== keepRow && values[index][0] === guestKey) {
      sheet.deleteRow(rowNumber);
    }
  }
}
