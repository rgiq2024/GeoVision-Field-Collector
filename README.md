# GeoVision Field Collector

Design field data forms, share them by link, QR code or poster, and collect points, lines and areas from any phone browser. Records go to your own Google Sheet (photos to your Google Drive) or to your own server.

**Open the app:** https://rgiq2024.github.io/geovision-field-collector/

## What it does

- **Design:** 15 question types (text, number, date, yes/no, single and multiple choice, dropdown, rating, slider, photo, signature and more), required questions, hints, defaults, min/max limits, conditional questions, drag to reorder, 7 templates, live phone preview.
- **Location:** point, line or area, from GPS with an accuracy check or by tapping the map; streets or satellite basemap.
- **Share:** link, QR code and printable poster. No app store; collectors can add it to the home screen and it works offline.
- **Real time:** records go to your Google Sheet via a generated Apps Script, photos to Google Drive. The live map refreshes every 5 seconds to 5 minutes.
- **Offline:** collectors export GeoJSON or CSV from the phone; "Import files from phones" merges them and skips duplicates.
- **Privacy:** the form link holds only the form and a submit token. The key for reading records stays in your browser and in your script.

## Phone apps

Android and iPhone apps live in [`mobile/`](mobile/README.md). Each push builds an installable Android APK and publishes it on the [Releases page](https://github.com/rgiq2024/geovision-field-collector/releases/latest). The iPhone app needs an Apple Developer account to sign; see the mobile README.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: designer on desktop, form on phones (`#f=…` links) |
| `sw.js` | Offline support (caches the app, libraries and viewed map tiles) |
| `manifest.json`, `icon-*.png` | Home-screen install |

Forms are saved in the browser you design them in. Use the same browser for the live map, since it holds each form's read key.
