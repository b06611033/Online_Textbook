FROM node:12-alpine AS builder
ARG server_domain
ENV REACT_APP_SERVER_DOMAIN=${server_domain:-http://localhost:8080}
WORKDIR /usr/src/myma-store
COPY . .
RUN cd coronavirus-client \
	&& yarn \
	&& yarn build \
	&& cd ../server \
	&& yarn \
	&& yarn build

FROM node:12-alpine
ARG environment
ARG synchronize=false
WORKDIR /myma-store
COPY --from=builder /usr/src/myma-store/coronavirus-client/build/ ./coronavirus-client/public
COPY --from=builder /usr/src/myma-store/server/dist ./server/dist
COPY --from=builder /usr/src/myma-store/server/node_modules ./server/node_modules
COPY --from=builder /usr/src/myma-store/server/ormconfig.js ./server/ormconfig.js
WORKDIR /myma-store/server
EXPOSE 8080
ENV NODE_ENV=${environment:-production}
RUN addgroup --system myma \
	&& adduser --system --no-create-home myma myma \
	&& apk update \
	&& apk add --no-cache netcat-openbsd
USER myma
ENV MYMA_STORE_DATABASE_SYNCHRONIZE=${synchronize}
ENV MYMA_IN_CONTAINER=true
ADD docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT [ "/docker-entrypoint.sh" ]
CMD [ "node", "dist/index.js" ]
