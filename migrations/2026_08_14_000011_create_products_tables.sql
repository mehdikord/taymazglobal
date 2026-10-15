-- ============================================================
-- 000011: محصولات (products, product_translations, product_specs,
-- product_spec_translations, product_media, product_media_translations, product_tag)
-- ============================================================

-- UP

CREATE TABLE products (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug        VARCHAR(255)    NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    type        ENUM ('physical','service') NOT NULL,
    price_type  ENUM ('fixed','inquiry','range') NOT NULL DEFAULT 'inquiry',
    price       DECIMAL(14,2)   NULL,
    price_max   DECIMAL(14,2)   NULL,
    currency    ENUM ('USD','EUR','TRY') NULL,
    is_featured BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NULL DEFAULT NULL,
    updated_at  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX products_slug_unique (slug),
    INDEX products_category_id_index (category_id),
    INDEX products_type_index (type),
    INDEX products_price_type_index (price_type),
    CONSTRAINT products_category_id_foreign
        FOREIGN KEY (category_id) REFERENCES product_categories (id) ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE product_translations (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id  BIGINT UNSIGNED NOT NULL,
    locale      ENUM ('fa','en','tr','ru') NOT NULL,
    title       VARCHAR(255)    NOT NULL,
    summary     TEXT            NULL,
    description TEXT            NULL,
    created_at  TIMESTAMP NULL DEFAULT NULL,
    updated_at  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX product_translations_product_locale_unique (product_id, locale),
    INDEX product_translations_locale_index (locale),
    CONSTRAINT product_translations_product_id_foreign
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE product_specs (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    sort_order INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX product_specs_product_id_index (product_id),
    CONSTRAINT product_specs_product_id_foreign
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE product_spec_translations (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    spec_id    BIGINT UNSIGNED NOT NULL,
    locale     ENUM ('fa','en','tr','ru') NOT NULL,
    label      VARCHAR(255)    NOT NULL,
    value      TEXT            NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX pst_spec_locale_unique (spec_id, locale),
    INDEX pst_locale_index (locale),
    CONSTRAINT pst_spec_id_foreign
        FOREIGN KEY (spec_id) REFERENCES product_specs (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE product_media (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id BIGINT UNSIGNED NOT NULL,
    type       ENUM ('image','video') NOT NULL DEFAULT 'image',
    path       VARCHAR(255)    NULL,
    sort_order INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX product_media_product_id_index (product_id),
    CONSTRAINT product_media_product_id_foreign
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE product_media_translations (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    media_id   BIGINT UNSIGNED NOT NULL,
    locale     ENUM ('fa','en','tr','ru') NOT NULL,
    alt        VARCHAR(255)    NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX pmt_media_locale_unique (media_id, locale),
    INDEX pmt_locale_index (locale),
    CONSTRAINT pmt_media_id_foreign
        FOREIGN KEY (media_id) REFERENCES product_media (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE product_tag (
    product_id BIGINT UNSIGNED NOT NULL,
    tag_id     BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (product_id, tag_id),
    INDEX product_tag_tag_id_index (tag_id),
    CONSTRAINT product_tag_product_id_foreign
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT product_tag_tag_id_foreign
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS product_tag;
DROP TABLE IF EXISTS product_media_translations;
DROP TABLE IF EXISTS product_media;
DROP TABLE IF EXISTS product_spec_translations;
DROP TABLE IF EXISTS product_specs;
DROP TABLE IF EXISTS product_translations;
DROP TABLE IF EXISTS products;
