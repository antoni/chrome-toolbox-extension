all: clean pack

EXT_NAME=chrome-toolbox-extension
ARCH_NAME=$(EXT_NAME).zip

pack:
	zip -r ~/$(ARCH_NAME) ~/$(EXT_NAME)

clean:
	rm ~/$(ARCH_NAME)
