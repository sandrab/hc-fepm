// Nodejs script to build javascript assets.
// This script assumes there is a project/assets/js/js-includes.json file that specifies
// the js file(s) that must be generated.

var fs = require('fs');
var uglify = require("uglify-js");

var jsSrcDirectory = 'project/assets/js/';
var jsBuildDirectory = 'project/js/';
var jsConfigJson = 'js-includes.json';

var FILE_ENCODING = 'utf-8', EOL = '\n';

// Read the config file to decide which js files must be generated.
var jsConfig = JSON.parse(fs.readFileSync(jsSrcDirectory + jsConfigJson));
var scripts = jsConfig.scripts;

// Generate a concatenated and a minified version for each of the scripts specified.
for( var scriptName in scripts ){

	// Read the contents of each file to include.
	var out = scripts[scriptName].map(function(filePath){
		return fs.readFileSync(filePath, FILE_ENCODING);
	});

	// Concatenate the contents of the separate files into the script file.
	var jsBuildFileName = jsBuildDirectory + scriptName;
	fs.writeFileSync(jsBuildFileName + ".js", out.join(EOL), FILE_ENCODING);

	// Generate a minified version of the scripts file as well.
	var uglified = uglify.minify(jsBuildFileName + ".js", {
		compress: false,
		mangle: false
	});
	fs.writeFileSync(jsBuildFileName + ".min.js", uglified.code);
}
