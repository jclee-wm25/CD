#!/usr/bin/env bash
# ==============================================================================
# LiveLocal - Automated Android SDK & Emulator Setup for Ubuntu / WSL2
# ==============================================================================
set -e

echo "🚀 Starting Android SDK & Emulator setup for LiveLocal..."

# 1. Check & Install required packages (unzip, wget, libpulse0, etc. for emulator)
echo "📦 Checking essential Linux dependencies..."
if ! ldconfig -p | grep -q "libpulse.so.0" || ! command -v unzip &> /dev/null || ! command -v curl &> /dev/null; then
    echo "Need to install required system libraries: libpulse0, libgl1, libnss3, etc. (requires sudo)..."
    sudo apt-get update
    sudo apt-get install -y unzip wget curl libpulse0 libgl1 libglx-mesa0 libnss3 libxcomposite1 libxcursor1 libxi6 libxtst6
fi

# 2. Add current user to 'kvm' group if /dev/kvm exists (for hardware acceleration)
if [ -e /dev/kvm ]; then
    echo "⚡ /dev/kvm detected (nested virtualization ready)!"
    if ! groups | grep -q '\bkvm\b'; then
        echo "Adding user '$USER' to 'kvm' group..."
        sudo usermod -aG kvm "$USER"
        sudo chmod 666 /dev/kvm || true
    fi
else
    echo "⚠️ /dev/kvm not found! Emulator will run very slowly without hardware acceleration."
fi

# 3. Create Android SDK directory hierarchy
export ANDROID_HOME="$HOME/Android/Sdk"
mkdir -p "$ANDROID_HOME/cmdline-tools"
cd "$ANDROID_HOME/cmdline-tools"

# 4. Download Google Android Command Line Tools (latest)
CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
if [ ! -d "$ANDROID_HOME/cmdline-tools/latest" ]; then
    echo "⬇️ Downloading official Android command-line tools..."
    wget -q --show-progress "$CMDLINE_TOOLS_URL" -O cmdline-tools.zip
    echo "📂 Extracting command-line tools..."
    unzip -q cmdline-tools.zip
    rm cmdline-tools.zip
    # Move extracted 'cmdline-tools' folder into 'latest' required by Android SDK specs
    mv cmdline-tools latest
else
    echo "✅ Android command-line tools ('latest') are already downloaded."
fi

# 5. Set up environment variables for the current session & persist in ~/.bashrc and ~/.zshrc
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

for RC_FILE in "$HOME/.bashrc" "$HOME/.zshrc"; do
    if [ -f "$RC_FILE" ] && ! grep -q "export ANDROID_HOME=$HOME/Android/Sdk" "$RC_FILE"; then
        echo "📝 Adding ANDROID_HOME and PATH variables to $RC_FILE..."
        cat << 'EOF' >> "$RC_FILE"

# ============================================
# Android SDK Environment Variables
# ============================================
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
EOF
    fi
done

# 6. Accept licenses and install packages
echo "📜 Accepting Android SDK licenses and installing packages..."
yes | sdkmanager --licenses > /dev/null 2>&1 || true

echo "📥 Installing platform-tools, build-tools, emulator, and API 34 system image..."
sdkmanager "platform-tools" "emulator" "build-tools;34.0.0" "platforms;android-34" "system-images;android-34;google_apis;x86_64"

# 7. Create Virtual Device (AVD) if it doesn't already exist
AVD_NAME="LiveLocal_AVD"
if ! avdmanager list avd | grep -q "Name: $AVD_NAME"; then
    echo "📱 Creating Android Virtual Device ('$AVD_NAME' - Pixel 6 specs)..."
    echo "no" | avdmanager create avd -n "$AVD_NAME" -k "system-images;android-34;google_apis;x86_64" --device "pixel_6" --force
else
    echo "✅ Android Virtual Device '$AVD_NAME' already exists."
fi

echo "=============================================================================="
echo "🎉 Setup Complete!"
echo "To apply environment variables right now, run:"
echo "   source ~/.bashrc"
echo ""
echo "To launch your Android Virtual Device directly on your desktop (via WSLg), run:"
echo "   emulator -avd LiveLocal_AVD -gpu host &"
echo ""
echo "To run your LiveLocal app on the emulator:"
echo "   cd /mnt/j/CD/LiveLocal && npx expo start --android"
echo "=============================================================================="
