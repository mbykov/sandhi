TESTS = test/node/*.js
#REPORTER = dot
REPORTER = spec
g = _

# build: components #morpheus.js
# @component build --dev

# components: component.json
# @component install --dev

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--slow 500 \
		--grep $(g) \
		--timeout 3000 \
		$(TESTS) \
#		2> /dev/null


clean:
	rm -fr build components template.js

.PHONY: test clean
