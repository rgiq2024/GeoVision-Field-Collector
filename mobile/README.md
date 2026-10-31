# GeoVision Collector for Android and iPhone

The phone app is the same collector form as the website, packaged with Capacitor so it installs like any other app. Libraries, fonts and the form all ship inside the app, so it opens and saves records with no signal.

On first launch the app asks the collector to **scan the form's QR code** (a photo of the poster or screen) or **paste the form link**. It remembers every form opened, and reopens the last one at launch. Records, GPS, photos, offline sending and file export work as in the browser; exports open the phone's share sheet so a file can go straight to WhatsApp or email.

## Android

Every push to `main` builds the app on GitHub Actions and publishes **GeoVision-Collector.apk** on the repository's Releases page. Open that page on an Android phone, download the APK and tap it to install (Android asks once to allow installs from the browser).

### Google Play (optional)

1. Create an upload key once: `keytool -genkey -v -keystore release.jks -alias geovision -keyalg RSA -keysize 2048 -validity 10000`
2. In the repo, open **Settings › Secrets and variables › Actions** and add:
   `ANDROID_KEYSTORE_BASE64` (output of `base64 -w0 release.jks`), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (`geovision`), `ANDROID_KEY_PASSWORD`.
3. The next build also publishes **GeoVision-Collector.aab**. Upload it in the Google Play Console. Keep `release.jks` safe; Play needs the same key for every update.

## iPhone

Apple only installs apps signed with an Apple Developer account (99 USD a year). The GitHub workflow builds the iPhone project for the Simulator on every push, which proves it compiles. To put it on phones:

1. On a Mac with Xcode: `cd mobile && npm ci && npm run ios`
2. In Xcode, select the **App** target › **Signing & Capabilities**, choose your team.
3. Plug in an iPhone and press Run, or use **Product › Archive** and upload to TestFlight / the App Store.

## Making changes

Edit `index.html` in the repo root (the website). The app build copies it into `mobile/www` and swaps the online libraries for bundled copies (`npm run build`). Then `npx cap sync` updates both native projects.

| Setting | Where |
| --- | --- |
| App name and ID (`io.github.rgiq2024.geovision`) | `capacitor.config.json`, then `npx cap sync` |
| Icons and splash | `android/app/src/main/res`, `ios/App/App/Assets.xcassets` |
| Location and camera permissions | `android/app/src/main/AndroidManifest.xml`, `ios/App/App/Info.plist` |
