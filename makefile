SHELL := /bin/bash

examples_pkg := $(wildcard examples/*/package.json)
examples_dst := $(subst package.json,_site,examples/*/package.json)
examples_npm := $(subst package.json,node_modules,$(examples_npm))

11tysnap.js: node_modules
	yarn tsc

.PHONY: clean
clean:
	rm -f 11tysnap.d.ts
	rm -f 11tysnap.js
	rm -rf examples/*/_site

.PHONY: distclean
distclean: clean
	rm -rf examples/*/node_modules

.PHONY:
examples/%/_site: examples/%/node_modules
	cd examples/$* && yarn build
	@if [[ `git status --porcelain examples/$*/_site` ]]; then \
		git --no-pager diff examples/$*/_site; \
		git clean -df examples; \
		git checkout -- examples; \
		exit -1; \
	fi

examples/%/node_modules:
	cd examples/$* && yarn --pure-lockfile

node_modules:
	yarn

.PHONY: test
test: clean 11tysnap.js $(examples_dst)
	