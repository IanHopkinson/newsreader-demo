run:    build
	@docker run \
	    -p 8000:8000 \
	    --read-only \
	    --rm \
	    --volume /tmp \
	    ianhopkinson/newsreader_demo

build:
	@docker build -t ianhopkinson/newsreader_demo .

.PHONY: run build