run:    build
	docker run \
		--name nwrdemo \
	    -p 8000:8000 \
	    --read-only \
	    --rm \
	    --volume //tmp \
	    -e NEWSREADER_PUBLIC_API_KEY \
	    ianhopkinson/newsreader_demo

build:	clean
	docker build -t ianhopkinson/newsreader_demo .

clean:
	-docker stop nwrdemo
	docker rm nwrdemo

.PHONY: run build