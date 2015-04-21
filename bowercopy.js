/*
* Helper nodejs script to copy bower assets into the vendors directories of the project. 
* Also handle special case for normalize.css into a normalize.scss so it can be included by sass files.
*/

var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');			// This requires the fs-extra module (globally installed with: sudo npm install -g fs-extra).
var util = require('util');

// Hardcoded locations:
var bowerDirectory = 'bower_components';
var vendorSassDirectory = 'project/assets/sass/vendors/';
var vendorJsDirectory = 'project/assets/js/vendors/';
var themeBuildDir = 'project/build-tools/';
var bowerJson = 'bower.json';

// Read bower.json to get a list of packages that are needed in this project (bower list gives me ALL installed packages, not just the ones used in bower.json).
var pkg = JSON.parse(fs.readFileSync(themeBuildDir + bowerJson));
var dependencies = pkg.dependencies;

// Ensure the vendor directories exist and empty them.
fse.emptyDirSync(vendorSassDirectory, function (err) {
	if (err) console.log('Error ensuring an empty vendor sass directory: ' + err);
});
fse.emptyDirSync(vendorJsDirectory, function (err) {
	if (err) console.log('Error ensuring an empty vendor js directory: ' + err);
});

// Read the bower.json of each package and copy the necessary assets from this package into the vendor directories.
for( var pkgName in dependencies ){
	var shortName = pkgName.substr(0, pkgName.indexOf('-'));
	if( shortName == "normalize" ){
		// Handle normalize case differently: only copy one file and rename it from css to scss.
		fse.copy(bowerDirectory + '/' + pkgName + '/' + 'normalize.css', vendorSassDirectory + shortName + '/normalize.scss', function(err){
			if (err) return console.error(err);
		});
	} else {
		// Handle other packages: copy everything from their main directory into the vendor directory followed by the short package name.
		var mainDirs = determineMainPath(pkgName);	// Contains paths like: bower_components/normalize-3.0.2/, bower_components/bourbon-4.2/app/assets/stylesheets/ or bower_components/neat-1.7/app/assets/stylesheets/.
		if( mainDirs.sass ){
			fse.copy(mainDirs.sass, vendorSassDirectory + shortName, function(err){
				if (err) return console.error(err);
			});
		}
		if( mainDirs.js ){
			fse.copy(mainDirs.js, vendorJsDirectory + shortName, function(err){
				if (err) return console.error(err);
			});
		}
	}
	continue;
}

// Helper function to find the 'main' of a bower.json. Return an array, for possible combi of a main sass and a main js.
function determineMainPath(pkgName){
	var mainDirs = {};
	try{
		var pkg = JSON.parse(fs.readFileSync(bowerDirectory + '/' + pkgName + '/' + bowerJson));
		var mains = [];
		if( util.isArray(pkg.main) ){
			// More then one main found. For now, we just assume this is one sass and one js.
			mains = pkg.main;
		} else {
			// Only one main found.
			mains.push(pkg.main);
		}
		for( var mainfile in mains ){
			var extension = path.extname(mains[mainfile]);
			var pkgMainDir = path.dirname(mains[mainfile]);
			if( '.' == pkgMainDir ){
				pkgMainDir = '';
			} else{
				pkgMainDir = pkgMainDir + '/';
			}
			if( '.js' == extension ){
				mainDirs.js = bowerDirectory + '/' + pkgName + '/' + pkgMainDir;
			} else {
				// For now we just assume anything else then js should be sass.
				mainDirs.sass = bowerDirectory + '/' + pkgName + '/' + pkgMainDir;
			}
		}
	} catch (e) {
		// No bower.json in this package or a bower.json without a 'main', so just take the rootdir and assume it should be sass.
		mainDirs.sass = bowerDirectory + '/' + pkgName;
	}
	return mainDirs;
}
