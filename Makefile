all: clean pack

EXT_NAME=chrome-toolbox-extension
ARCH_NAME=$(EXT_NAME).zip

pack:
	zip -r ~/$(ARCH_NAME) ~/$(EXT_NAME)/dist

tslint_init:
	# Generate a basic configuration file
	tslint --init

tslint_lint:
	# Lint TypeScript source globs
	tslint --fix -c tslint.json 'src/**/*.ts'

clean:
	rm ~/$(ARCH_NAME)

