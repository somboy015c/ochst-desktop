# OCHST Staff desktop app

A small desktop app (Windows and macOS) that opens the OCHST staff portal in its own window.
Built with [Tauri](https://tauri.app), so the installer is only a few megabytes.

What staff see:

1. An animated splash screen.
2. A three-slide welcome (first launch only): admissions and students; courses, lecturers and results; fees, hostels and notices.
3. The staff portal (`https://staff.ochst.edu.ng`). If there is no internet, a friendly "You are offline" screen with a Try again button.

The portal hides its **Download app** button when it is opened inside this app.

## Get the installers (no coding needed)

1. Create a new repository on GitHub (any name, for example `ochst-staff-desktop`) and upload everything in this folder to it
   (on the repository page choose **Add file → Upload files**, drag the contents of the folder in, then **Commit changes**).
   The `.github` folder must be uploaded too (Mac Finder hides folders that start with a dot; press Cmd+Shift+. to show them). If it did not upload, on the repository page choose **Add file → Create new file**, type `.github/workflows/release.yml` as the name, and paste in the contents of that file.
2. Open the repository's **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions**, press **Save**.
3. Open the **Actions** tab. The workflow **Build and release desktop apps** starts by itself on every push to `main`.
   (You can also press **Run workflow**.) It takes about 10 to 15 minutes.
4. When it is green, open the **Releases** page of the repository: the Windows installer (`.exe`, `.msi`) and the Mac disk image (`.dmg`) are there.
5. In the staff portal go to **School settings → Desktop app downloads** and paste
   `https://github.com/YOUR-NAME/YOUR-REPO/releases/latest` into both the Windows and macOS boxes.
   The "Download app" button in the portal then sends staff to the newest release.

## Releasing a new version

Change `version` in `src-tauri/tauri.conf.json` (and `src-tauri/Cargo.toml`), commit, and the workflow publishes a new release.
(If the version is not changed, the existing release's files are replaced.)

## Changing the address or the look

* Portal address: `STAFF_URL` at the top of `src/app.js`.
* Slides and splash text: `src/index.html`. Colours and animation: `src/style.css`.
* App icon: replace `app-icon.png` (a square PNG, 1024 x 1024 is best); the build makes every icon size from it.

## First-time warnings (the app is not code-signed)

* **Windows** may show "Windows protected your PC": choose **More info → Run anyway**.
* **macOS** may say the app cannot be opened: right-click the app, choose **Open**, then **Open**. If it says the app is "damaged", run `xattr -cr "/Applications/OCHST Staff.app"` once in Terminal.

## Run it on your own computer (optional)

```
npm install
npm run icons
npm run dev
```
You need Node 20+ and [Rust](https://rustup.rs). On Windows, also the "Desktop development with C++" build tools.

## If the app shows an old version of the portal

The app shows the live website, so website updates need no new build. If it still looks old, press **Cmd+R** (Mac) or **Ctrl+R** (Windows).
For a full clean-out, quit the app and delete its stored data, then open it again (you will have to sign in again):
* **Mac:** delete the folders `~/Library/WebKit/ng.edu.ochst.staff` and `~/Library/Caches/ng.edu.ochst.staff` (in Finder choose Go, Go to Folder, and paste the path).
* **Windows:** delete the folder `%LOCALAPPDATA%\ng.edu.ochst.staff`.
