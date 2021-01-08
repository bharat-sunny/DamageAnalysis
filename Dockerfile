### STAGE 1: Build ###
FROM node:12.0-alpine AS builder

COPY . ./DamageAnalysis
WORKDIR /DamageAnalysis




### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /DamageAnalysis/dist/DamageAnalysis /usr/share/nginx/html
