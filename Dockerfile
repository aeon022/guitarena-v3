# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Verhindert, dass der interne Nginx auf HTTP umleitet
    absolute_redirect off;

    location / {
        try_files $uri /index.html;
    }

    # Error pages
    error_page 404 /404.html;
}
EOF
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
