-- ============================================================
-- 000010: دسته‌بندی محصولات (product_categories, product_category_translations)
-- ============================================================

-- UP

CREATE TABLE product_categories (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug       VARCHAR(255)    NOT NULL,
    gradient   VARCHAR(255)    NULL,
    accent     VARCHAR(255)    NULL,
    is_active  BOOLEAN         NOT NULL DEFAULT TRUE,
    sort_order INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX product_categories_slug_unique (slug)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE product_category_translations (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id BIGINT UNSIGNED NOT NULL,
    locale      ENUM ('fa','en','tr','ru') NOT NULL,
    title       VARCHAR(255)    NOT NULL,
    description TEXT            NULL,
    created_at  TIMESTAMP NULL DEFAULT NULL,
    updated_at  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX pct_category_locale_unique (category_id, locale),
    INDEX pct_locale_index (locale),
    CONSTRAINT pct_category_id_foreign
        FOREIGN KEY (category_id) REFERENCES product_categories (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS product_category_translations;
DROP TABLE IF EXISTS product_categories;
