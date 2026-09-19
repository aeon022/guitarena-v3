# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Ändert sich pro Tag -> Cache-Bust, damit ein nächtlicher Rebuild "kommend/vergangen" neu berechnet
ARG BUILD_DATE=unset
RUN echo "build $BUILD_DATE" && npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Single Quotes um 'EOF' verhindern, dass $uri von der Shell gelöscht wird
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    absolute_redirect off;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.ics$ {
        default_type text/calendar;
    }

    error_page 404 /404.html;
}
EOF
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
