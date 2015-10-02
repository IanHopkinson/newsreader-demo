run:    build
	@docker run \
	    -p 8000:8000 \
	    --read-only \
	    --rm \
	    --volume /tmp \
	    -e NEWSREADER_PUBLIC_API_KEY \
	    ianhopkinson/newsreader_demo

build:
	@docker build -t ianhopkinson/newsreader_demo .

.PHONY: run build