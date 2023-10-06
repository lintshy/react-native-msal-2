# README #

Author: Govind.Jayan@hdsupply.com

### What is this repository for? ###

* React Native app (Android/Zebra) for DC Quality Audits
* Version: 1.0.5


# Setup


## Tools Required
* VS Code
* Git Bash
* Nodejs 18
* Android Studio with ADB
* JDK 17+




## Testing

```
npm run test
```

## Installation

Install dependencies 
```
npm ci
```

**Run local server**

If you cannot access hds APIs (if you are outside VPN). Check your local ipv4 address and replace it inside package.json script command for start:local-server and src/Config/config.local.ts, then:
```
npm run start:local-server
```

**Run on emulator**

After starting desired emulator on Android Studio. (Tested android versions : 10, 11, 12)

```
npm run start:android
```



**Publish release build**

For a routine build:
```
npm run build:android
```

For a customized build experience, with provision to choose environment and version number:

```
npm run release:android

or, if you are running this from a mac:

npm run release:android-mac
```
Currently, there is no available CICD pipeline to publish the apk to a zebra device, hence we have to share the apk with Travis (mentioned in the Datawedge section) to publish to target devices.

## ADB Utility commands 

 Replace 23056522517103 with your device id or skip -s option if you have only one device connected

* List devices
```
adb devices
```
* Setup Reverse Proxy
```
adb -s 23056522517103 reverse tcp:8081 tcp:8081
```
* Reload event
```
adb -s 23056522517103 shell input keyevent 82
```
* Install Release build
```
adb -s 23056522517103 install android/app/build/outputs/apk/release/app-release.apk
```




