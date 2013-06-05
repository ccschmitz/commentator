
build: components index.js commentator.css lib/template.js
	@component build --dev

lib/template.js: lib/template.html
	@component convert $<

components: component.json
	@component install --dev

clean:
	rm -fr build components lib/template.js

test:
	node_modules/.bin/jasmine-node test/

.PHONY: clean test
