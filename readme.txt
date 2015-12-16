Commands used to build stuff in this project:

> Start the vagrant box:
Open cmd prompt in D:\vagrant\greenhost\ and run: vagrant up

> SSH into the vagrant box:
Start putty, open the 'Vagrant' session, login as vagrant/vagrant and cd into the project's build-tools directory: cd /vagrant/fepm/project/build-tools/

> Check if the current version of hc-fepm is the version needed for the current project.
npm run check
If this indicates the version of hc-fepm is not the version used for this project, manually copy the correct version from fepm/bower_components/hc-fepm-x.y.z/ into fepm/.

> Check if there are updates available for bower components:
bower list

> If there are new bower components to install for the first time after adding them to bower.json:
bower install

> Update bower components that were installed before but have new updates available:
bower update

> Generate style.css using sass:
npm run build:css

> Generate minified style.min.css using sass:
npm run build:cssmin

> Generate editor-style.css using sass:
npm run build:editorcss

> Generate js (generates both normal and minified versions of each scripts key specified in assets/js/js-includes.json) [Note: the project/js/ folder must already exist]:
npm run build:js

> Generate all css and js together in one go:
npm run build

> Stop the vagrant box:
In the cmd prompt in D:\vagrant\greenhost\ and run: vagrant halt
