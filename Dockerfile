FROM ubuntu:15.04

RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
        python-pip \
        gunicorn

RUN mkdir /home/newsreader-demo && \
    chown nobody /home/newsreader-demo

USER nobody
ENV HOME=/home/newsreader-demo
WORKDIR /home/newsreader-demo

ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:8000"]
EXPOSE 8000
CMD ["--log-file", "-", "--access-logfile", "-", "app:app"]

COPY ./requirements.txt /home/newsreader-demo/app/
RUN pip install --user -r /home/newsreader-demo/app/requirements.txt
COPY ./app /home/newsreader-demo/app/