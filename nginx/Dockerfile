# pull official base image
FROM nginx:alpine

# remove default config
RUN rm /etc/nginx/conf.d/default.conf

# copy actual config
COPY ../front/nginx.conf /etc/nginx/conf.d
