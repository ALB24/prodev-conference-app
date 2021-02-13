# This is a multi-stage build Dockerfile. It builds one
# image, does some work, builds another image that
# uses build output from the first, and then only
# deploys the second image. The first image builds the
# React application. The second images takes the content
# from the build process and serves it from Nginx,
# essentially throwing away the gunk from the first image.

# Build the React app
FROM node:15.8.0-alpine3.12
WORKDIR /usr/src/app
COPY package*.json ./
RUN ["npm", "install"]
COPY . .
ARG REACT_APP_API_URL
RUN ["npm", "run", "build"]

# Host the content from the build
FROM nginx:latest
# This is the directory from which Nginx serves
# its content as specified in the frontend.nginx.conf
# file with the "root" directive.
WORKDIR /usr/share/nginx/html
# Copy the nginx configuration into the image
COPY frontend.nginx.conf /etc/nginx/conf.d/default.conf
# Copy the output of the build from the last image into
# this one
COPY --from=0 /usr/src/app/build .
# The Nginx docker image will start on its own, so no need
# for a CMD statement, here.