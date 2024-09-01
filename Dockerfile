FROM denoland/deno
EXPOSE 8000
WORKDIR /app
ADD . /app
RUN deno cache src/main.ts

CMD ["run", "--allow-net", "--allow-env", "src/main.ts"]
