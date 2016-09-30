## Initial installation
1. Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
2. Install Sass (in terminal): run `gem install sass` or on mac `sudo gem install sass`
3. Install [NodeJS](https://nodejs.org/)
4. Install Gulp (in terminal): run `npm install -g gulp`
5. Install [Git] (https://git-scm.com/download/win)
6. Install Bower (in terminal): run `npm install -g bower`


## Installation frontend project
1. In terminal: Go to project folder.
2. In terminal: run `npm install`
3. In terminal: run `bower install`
4. In terminal: run `gulp`
5. Then go to the browser and paste: "http://localhost:3000/".


## Deploy to UI-Preview
1. Getting a get latest from TFS.
2. In terminal: go to the project folder
3. In terminal: Run the default-gulp task ('gulp')
4. In terminal: Run the deploy-gulp task ('gulp deploy')
5. You can take a look at http://www.ui-preview.truelimehosting.nl/'[Projectname]'


## Deploy to kentico
1. After building, the assets folder should be available
   Assuming you have the full source tree checked out, you can manually copy the assets to
   the Kentico source tree.
2. In terminal: copy-to-kentico (windows) ./copy-to-kentico.sh (mac)
3. If desired, commit all the changes to the Kentico assets folder in TFS
