
![Dropifier](app/resources/app-icon-gavicon.png "Dropifier") 

Dropifier
=======
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

## Supported platforms
*  MacOS


Developer setup
=======

## Requirements
* NodeJS
* Electron


## Steps
1. Clone repo to your local machine \
`git clone https://github.com/kemuri/Dropifier.git`
2. Install dependencies \
`npm install`
3. Setup your Apple Developer Keys for codesign \
https://www.electron.build/code-signing
3. Setup a .env file for your Developer credentials \
`APPL_ID=email@mail.com` \
`APPL_PASS=app-specific-dev-pass`
3. Run `npm dist` to sign and notarize the app

Version History
=======
### 1.0 - Initial release
Working application with the barebones functionality.










 
