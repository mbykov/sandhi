#
# Executables.
#

BIN := node_modules/.bin
DUO := $(BIN)/duo
g = _
REPORTER = spec
TESTS = test/node/*.js
GITA = test/gita/*.js
SAMASA = test/samasa/*.js

#
# Source wildcards.
#

JS = index.js $(wildcard lib/*/*.js)
JSON = $(wildcard lib/*/*.json)

#
# Default
#

all: clean build/index.js

#
# Targets.
#

# Create the build directory.
build:
	mkdir -p $@

# Install npm dependencies and ensure mtime is updated
node_modules: package.json
	@npm install
	@touch $@

#
# Phony targets/tasks.
#

# Cleanup previous build.
clean:
	rm -rf build #components

#--bail

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--slow 500 \
		--grep $(g) \
		--timeout 3000 \
		$(TESTS) \
		2> /dev/null

gita:
	@node test/gita/dict2clean.js


.PHONY: all clean server test
