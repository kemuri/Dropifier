
![Dropifier](app/resources/app-icon-gavicon.png "Dropifier") 

# Dropifier
Dropifier is a tiny macOS app for teams: it opens your Dropbox links directly in Finder.

## How to use

1. **Drop** \
Simply drag and drop any file or folder from your Dropbox directory to the Dropifier icon in the top right corner.

2. **Share** \
Dropfier will create the link, and copy it to your clipboard automatically.
Simply paste (⌘+V) the link to your co-worker.

3. **Enjoy** \
Clicking on a Dropifier link will now open the given file or folder directly in Finder!

## Features
* Autoupdates
* Animated menubar icon
* History
* Autodetect Dropbox location
* Locate file in Dropbox share URL

## Supported platforms
*  MacOS


Developer setup
=======

## Requirements
* NodeJS
* Electron


## Steps
1. Clone repo to your local machine \
`$ git clone https://github.com/kemuri/Dropifier.git`
2. Install dependencies \
`$ npm install`
3. Setup your Apple Developer Keys for codesign \
https://www.electron.build/code-signing
4. Setup a .env file for your Developer credentials \
`APPL_ID=email@mail.com` \
`APPL_PASS=app-specific-dev-pass`
5. Setup your GitHub access token as an ENV variable 
`$ export GH_TOKEN=mygithub token`
6. Run `$ npm dist` to sign and notarize the app

Version History
=======

### 1.0.3 - Reverse Drop
Now you can a drop a Dropbox url, and the app will try to find the given file in your Dropbox folder. Currently only works for files, not for folders.

### 1.0 - Barely usable
Working application with the barebones functionality.










 
