#!/bin/bash

# Build script for web deployment
set -e

echo "🚀 Starting web build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Build web app
echo "🏗️ Building web application..."
npx expo export --platform web

# Optimize build
echo "⚡ Optimizing build..."

# Create CNAME file for custom domain
echo "app.falandodegti.com.br" > dist/CNAME

# Create robots.txt
cat > dist/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://app.falandodegti.com.br/sitemap.xml
EOF

# Create sitemap.xml
cat > dist/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://app.falandodegti.com.br/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://app.falandodegti.com.br/pecas</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://app.falandodegti.com.br/cores</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://app.falandodegti.com.br/fusiveis</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
EOF

# Add meta tags for SEO (if not already present)
if [ -f "dist/index.html" ]; then
  echo "🔍 Adding SEO meta tags..."
  
  # Backup original
  cp dist/index.html dist/index.html.backup
  
  # Add meta tags
  sed -i.bak '/<head>/a\
    <meta name="description" content="Encontre peças compatíveis para seu Volkswagen Golf MK3. Base completa com códigos de cores VW e diagramas de fusíveis.">\
    <meta name="keywords" content="golf mk3, peças compatíveis, volkswagen, gti, cores vw, fusíveis, falando de gti">\
    <meta name="author" content="Falando de GTI">\
    <meta property="og:title" content="Golf MK3 - Peças Compatíveis">\
    <meta property="og:description" content="Seu guia completo para peças compatíveis, cores e fusíveis do Volkswagen Golf MK3">\
    <meta property="og:url" content="https://app.falandodegti.com.br">\
    <meta property="og:type" content="website">\
    <meta property="og:site_name" content="Falando de GTI">\
    <meta name="twitter:card" content="summary_large_image">\
    <meta name="twitter:title" content="Golf MK3 - Peças Compatíveis">\
    <meta name="twitter:description" content="Seu guia completo para peças compatíveis, cores e fusíveis do Volkswagen Golf MK3">\
    <link rel="canonical" href="https://app.falandodegti.com.br">' dist/index.html
fi

# Create .htaccess for Apache servers
cat > dist/.htaccess << EOF
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# Redirect HTTP to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle client-side routing
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

echo "✅ Web build completed successfully!"
echo "📁 Build output: ./dist/"
echo "🌐 Ready for deployment to: https://app.falandodegti.com.br"