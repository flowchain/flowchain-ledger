TESTS = $(shell find tests/suite/test.*.js)

test:
	@./tests/run $(TESTS)

.PHONY: test
