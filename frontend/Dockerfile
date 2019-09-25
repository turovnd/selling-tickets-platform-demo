FROM node:current-alpine as build-stage
WORKDIR /app
COPY ./frontend/package.json .
RUN npm install
COPY ./frontend .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./ssl /etc/ssl
COPY --from=build-stage /app/dist /usr/share/nginx/app
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
