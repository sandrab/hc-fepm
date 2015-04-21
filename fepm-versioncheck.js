// Check whether the currently active version of hc-fepm in fepm/ is the version needed for building the current project in fepm/project.

var fs = require('fs');

var themeBuildDir = 'project/build-tools/';
var bowerJson = 'bower.json';

// Get the current hc-fepm information from fepm/package.json.
var fepm = require('./package.json');
var currentVersion = fepm.version;
var fepmName = fepm.name;

// Read bower.json to get the hc-fepm version that is  needed to build this project.
var pkg = JSON.parse(fs.readFileSync(themeBuildDir + bowerJson));
var devDeps = pkg.devDependencies;
for( var pkgName in devDeps ){
	var shortName = pkgName.substr(0, pkgName.lastIndexOf('-'));
	if( shortName == fepmName ){
		var pkgUrl = devDeps[pkgName];
		var versionNeeded = pkgUrl.substr(pkgUrl.indexOf('#') + 1);
		break;
	}
}
if( currentVersion == versionNeeded ){
	console.log("OK - version of hc-fepm is: " + currentVersion);
} else {
	console.log("ERROR - current version of hc-fepm is " + currentVersion + ", version needed for this project is " + versionNeeded + "!");
}
