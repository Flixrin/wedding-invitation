# Invitation

Static church blessing invitation for Mariska & Kevin with guest-specific RSVP links.

This is suitable for GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static website host.

## Guest list from Excel

Keep the guest list in Excel with these columns:

- `guest_key`
- `name`
- `max_guests`

You can start from `guest-list-template.csv`, open it in Excel, edit it, then save/export it as CSV. If `guest_key` is blank, the converter generates a random-looking invitation code for that guest.

Generate the website guest database:

```bash
node tools/convert-guests.js guest-list-template.csv
```

Generate guest links for a hosted site:

```bash
node tools/convert-guests.js guest-list-template.csv --base=https://your-username.github.io/Invitation/
```

This creates:

- `guests.json`, used by the website to show each guest name and maximum guest count.
- `guest-links.csv`, used by you to copy each personalized invite link back into Excel.

Important: GitHub Pages and other static hosts are public. Do not put private details such as phone numbers, addresses, or email addresses in `guests.json`; keep only display names and maximum guest counts.

If a visitor opens the site without a valid `guest` code, the RSVP form is hidden and no submission is allowed.

Guest links use the `guest` query parameter, for example:

```text
https://your-username.github.io/Invitation/?guest=glen
```

## Connect RSVP to Google Sheets

1. Create a Google Sheet.
2. Open `Extensions > Apps Script`.
3. Paste the contents of `google-apps-script.js`.
4. Save, then deploy as a Web App.
5. Set access to `Anyone`.
6. Copy the Web App URL.
7. Paste it into `script.js`:

```js
const RSVP_ENDPOINT = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
```

Once the endpoint is set, RSVP submissions will be saved to a sheet tab named `RSVP`.

If the same personalized guest link submits again, the existing row for that `guest_key` is updated instead of adding a duplicate row. When a guest opens their link again, their previous guest count and note are loaded back into the RSVP form.

## Event details

Update the `EVENT_DETAILS` block near the top of `script.js` when the church blessing details are final:

```js
const EVENT_DETAILS = {
  title: "Mariska & Kevin Church Blessing",
  dateText: "Saturday, 1 January 2027",
  timeText: "10:00 AM",
  venue: "Church Name",
  address: "Full church address",
  startsAt: "2027-01-01T10:00:00+08:00",
  endsAt: "2027-01-01T11:30:00+08:00",
  mapUrl: "https://maps.google.com/?q=Church+Name"
};
```

The Maps button and calendar download will stay disabled until `mapUrl`, `startsAt`, and `endsAt` are filled in.

## Gift transfer details

The gift section currently contains placeholders. Replace the bank name, account number, and account holder text in `index.html` when Mariska and Kevin confirm the transfer details.

## Host on GitHub Pages

1. Create a GitHub repository.
2. Upload/push the files in this folder.
3. In the repository, open `Settings > Pages`.
4. Set source to the main branch and root folder.
5. Wait for GitHub to publish the site.
6. Run the converter again with your published GitHub Pages URL to create final guest links.

## Preview locally

```bash
node tools/static-server.js 8000
```

Open `http://localhost:8000/?guest=glen`.
