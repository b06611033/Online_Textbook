FROM node:12-alpine AS builder
WORKDIR /usr/src/myma-store
COPY . .
RUN ls /usr/src/myma-store/server/
RUN cd coronavirus-client \
	&& yarn \
	&& yarn build \
	&& cd ../server \
	&& yarn \
	&& yarn build


FROM node:12-slim
RUN groupadd -r myma && useradd --no-log-init -r -g myma myma
USER myma
ARG environment
WORKDIR /myma-store
COPY --from=builder /usr/src/myma-store/coronavirus-client/build/ ./coronavirus-client/public
COPY --from=builder /usr/src/myma-store/server/build ./server
COPY --from=builder /usr/src/myma-store/server/node_modules ./server/node_modules
COPY --from=builder /usr/src/myma-store/server/${environment:-development}.env ./server
WORKDIR /myma-store/server
EXPOSE 8080
ENV NODE_ENV=${environment:-development}
CMD ["node", "./index.js"]
