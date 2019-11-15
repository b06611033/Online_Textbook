FROM node:10-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn \
	&& yarn build

FROM node:10-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build/ ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "./src/index.js"]
