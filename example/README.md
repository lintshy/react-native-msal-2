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

## Datawedge settings and running on a Zebra Device

If not already done, Contact Travis Epperson for access to a physical Zebra device or a virtual device in the [Lab](https://gfmsoti01wpl.hds.hdsupply.com/mobicontrol/WebConsole/home/devices/8867948f33f105010019284522512226/DeviceDetails?groups=%5C%5CLAB%5CWarehouse%20EWM%5CWMS)



Datawedge intent output settings for shipaudit app are as follows:

* enabled: checked

* Intent action: com.hds.shipaudit.scan

* Intent delivery: Broadcast intent

Settings in device> Datawedge app> Profile0 (default):
<img src="./assets/DatawedgeSettings.png" style="height: 400px; width:200px;"/>

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

**Run on Android Mobile**

Currently unable to access metro bundler or local server started in HDS laptop from a connected device even on the same Wifi. Tried updating baseUrl via RN debug menu. TODO to fix.

Workaround is to checkout this repo on your external laptop and run local server. Update external laptop ip:port as source in RN JS debug menu.

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

## Certificate usage

The app connects to APIs in *.hdsupply.net domain. Because of the recent android security updates, we have to update the .pem of the API server certificate in the app.

* Go to any of the environemnts of the web app:
![Alt text](./assets/GettingCert1.png?raw=true "Title")
* Open Certificate>Details>Export as cer2.pem
* Replace this file inside android/app/src/main/res/raw
* If you want to change the filename, update the same under android/app/src/main/res/xml/network_security_config.xml

Make sure to be aware of the certificate expiry date and plan for a release aligning with the certificate renewal.

## RBAC

The app currently uses Azure MSAL for authentication.

[Azure App Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/8be6111f-c94e-4a55-9e56-4aaa9936bdc1/isMSAApp~/false)

[Azure Enterprise App](https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/Overview/objectId/8d490e47-7619-49ba-a639-28af8d0fcbb3/appId/8be6111f-c94e-4a55-9e56-4aaa9936bdc1/preferredSingleSignOnMode~/null/servicePrincipalType/Application)

[Active Directory Group](https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupDetailsMenuBlade/~/Overview/groupId/85d9a941-4e9e-445e-ac5d-c22b0463c622)

[AD Admin page to modify members](https://ias.hdsupply.net/AssociateDirectoryPlus/Admin-Groups.aspx)
