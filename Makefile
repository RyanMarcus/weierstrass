
dist/weierstrass.min.js: package.json node_modules weierstrass.js
	./node_modules/browserify/bin/cmd.js weierstrass.js -g babelify -g uglifyify \
	| ./node_modules/uglify-js/bin/uglifyjs -c -m \
	> dist/weierstrass.js

node_modules:
	npm install

