# Stage-1 dependencies
FROM node:latest as dep

RUN mkdir /sample
WORKDIR /sample

ADD package.json .
RUN ["yarn","install"]


# Stage-2 final image
FROM node:alpine

WORKDIR /app
COPY . .

COPY --from=dep /sample/node_modules ./node_modules

RUN mkdir -p /opt/vitals
VOLUME /opt/vitals

EXPOSE 2368
CMD ["yarn", "start"]