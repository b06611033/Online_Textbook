FROM node:12-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn \
	&& yarn build

FROM node:12-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build/ ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/development.env ./
EXPOSE 8080
ENV NODE_ENV=development
CMD ["node", "./index.js"]
