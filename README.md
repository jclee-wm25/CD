# Repo Setup & Team Setup Guide

This section provides comprehensive step-by-step instructions for team members (`RSW2S2G2`) to set up, install, and run the **LiveLocal** React Native (Expo SDK 57) mobile application locally across different Operating Systems (**macOS, Windows, and Linux / WSL2**).

---

## 1. Universal Prerequisites (All Operating Systems)
Before cloning the project, ensure your development environment meets the following baseline requirements:
* **Node.js**: Version `18.x` or `20.x` LTS ([Download Node.js](https://nodejs.org/))
* **Git**: To clone and manage the repository
* **Expo / React Native Tools**: You do not need to globally install `expo-cli` (we use `npx expo` locally via dependencies)
* **Package Manager**: `npm` (included with Node.js)

---

## 2. Cloning & Installing Dependencies
Run the following commands inside your terminal (or command prompt / PowerShell) to get the codebase and install packages:

```bash
# 1. Clone the repository
git clone https://github.com/jclee-wm25/CD.git
cd LiveLocal

# 2. Install project dependencies
npm install
```

---

## 3. Option A: Running on Physical Mobile Devices (Recommended for All Teammates)
The easiest way to test and run the application without heavy SDK or Xcode installations is using your physical **iOS** (iPhone/iPad) or **Android** phone via the **Expo Go** mobile app.

1. Download **Expo Go** from the **Apple App Store** (iOS) or **Google Play Store** (Android).
2. Ensure your computer and your mobile phone are connected to the **same Wi-Fi network**.
3. Start the local development server in your terminal:
   ```bash
   npx expo start
   ```
4. **Connect your phone:**
   * **On iOS (iPhone):** Open your native **Camera app** and scan the QR code displayed in the terminal. Tap the prompt to open in Expo Go.
   * **On Android:** Open the **Expo Go app**, tap **Scan QR Code**, and scan the terminal QR code.
5. The LiveLocal app will bundle and open instantly on your physical device with live reloading enabled!

---

## 4. Option B: Running on Virtual Simulators & Emulators by Operating System

If you prefer testing on desktop virtual devices instead of physical phones, follow the setup instructions specific to your Operating System below:

### 🍏 macOS Setup
macOS developers can run both the **iOS Simulator** and **Android Emulator**.

#### Running on iOS Simulator (macOS Only):
1. Install **Xcode** from the macOS Mac App Store.
2. Open Xcode, go to **Settings > Components**, and download the latest **iOS Simulator runtime**.
3. Open terminal and install Xcode command line tools if not already installed:
   ```bash
   xcode-select --install
   ```
4. Launch the app on the iOS Simulator:
   ```bash
   cd LiveLocal
   npx expo start --ios
   ```

#### Running on Android Emulator (macOS):
1. Download and install [Android Studio](https://developer.android.com/studio).
2. Open **Android Studio > Virtual Device Manager (AVD)** and create a new virtual device (e.g., Pixel 6 with API 34).
3. Start the virtual device. Once booted, run inside your terminal:
   ```bash
   npx expo start --android
   ```

---

### 🪟 Windows Setup
Windows developers can run the **Android Emulator** (iOS simulation requires physical Expo Go or a Mac build server).

#### Running on Android Emulator (Windows):
1. Download and install [Android Studio](https://developer.android.com/studio).
2. During setup, ensure **Android SDK**, **Android SDK Platform-Tools**, and **Android Virtual Device** are checked.
3. Add your Android SDK path (`C:\Users\<YourUsername>\AppData\Local\Android\Sdk\platform-tools`) to your Windows **Environment Variables (`PATH`)**.
4. Open **Android Studio > Virtual Device Manager** and click **Create Device** (select Pixel 6, API Level 34).
5. Launch the emulator from Virtual Device Manager, then open PowerShell/CMD and run:
   ```bash
   cd LiveLocal
   npx expo start --android
   ```

---

### 🐧 Linux & Ubuntu / WSL2 Setup
For teammates developing on Linux or Windows Subsystem for Linux 2 (**WSL2 with Ubuntu 24.04**), we provide an **automated setup script (`setup_android_sdk.sh`)** that configures the official Android Command-Line Tools, required audio/graphics system libraries (`libpulse0`, `libgl1`), and creates a headless or GUI virtual device (`LiveLocal_AVD`).

#### Step 1: Run the Automated Setup Script
```bash
cd LiveLocal
chmod +x setup_android_sdk.sh
./setup_android_sdk.sh
```
*(Note: If you encounter system library issues during setup, ensure you run `sudo apt-get update && sudo apt-get install -y libpulse0 libgl1 libglx-mesa0 libnss3 libxcomposite1 libxcursor1 libxi6 libxtst6`).*

#### Step 2: Load Environment & Launch Virtual Mobile
After installation, reload your shell configuration (`~/.bashrc` or `~/.zshrc`) and launch the emulator:
```bash
# Load environment variables
source ~/.bashrc   # Or source ~/.zshrc if using Zsh

# Launch the virtual mobile device (WSLg desktop forwarding enabled)
emulator -avd LiveLocal_AVD -gpu host &
```

#### Step 3: Run the App on the Linux/WSL2 Emulator
Once the Android home screen boots up inside the emulator window:
```bash
cd LiveLocal
npx expo start --android
```

---

## 5. Troubleshooting & Useful Commands

* **Clear Metro Bundler Cache:** If you experience stale styles or bundling errors, restart with the cache flag:
  ```bash
  npx expo start -c
  ```
* **Port Conflicts:** If port `8081` is already in use by another process, Expo will automatically ask to use an alternative port (e.g., `8082`), or you can kill conflicting Node processes using `killall node` (macOS/Linux) or Task Manager (Windows).
* **Network QR Code Connection Issues:** If your physical phone cannot connect via Wi-Fi QR code, run Expo using Tunneling:
  ```bash
  npx expo start --tunnel
  ```
