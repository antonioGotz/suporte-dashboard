# 1. IMAGEM BASE
FROM php:8.2-fpm-alpine

# 2. DIRETÓRIO DE TRABALHO
WORKDIR /var/www/html

# 3. INSTALAR DEPENDÊNCIAS DO SISTEMA
RUN apk update && apk add --no-cache \
    git \
    openssl \
    bash \
    curl \
    curl-dev \
    # Dependências para compilar extensões PHP
    libpng-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    libjpeg-turbo-dev \
    freetype-dev

# 4. INSTALAR EXTENSÕES PHP (Foco em MySQL)
RUN docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    mysqli \
    mbstring \
    zip \
    xml \
    curl \
    opcache \
    gd \
    intl \
    bcmath

# 5. INSTALAR COMPOSER
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# 6. COPIAR CÓDIGO FONTE
COPY . /var/www/html/

# 8. CRIAR USUÁRIO WWW-DATA (Alpine não tem por padrão)
RUN addgroup -g 82 -S www-data || true \
    && adduser -u 82 -D -S -G www-data www-data || true

# 9. CRIAR DIRETÓRIOS NECESSÁRIOS ANTES DO COMPOSER
RUN mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# 10. DEPENDÊNCIAS DO LARAVEL
RUN composer install --no-dev --optimize-autoloader

# 11. AJUSTAR PERMISSÕES APÓS COMPOSER
RUN chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html

# 12. EXPOR PORTA PHP-FPM
EXPOSE 9000

# 13. COMANDO DE INÍCIO
CMD ["php-fpm"]

