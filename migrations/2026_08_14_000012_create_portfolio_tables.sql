-- ============================================================
-- 000012: نمونه‌کارها (portfolio_items, portfolio_translations,
-- portfolio_metrics, portfolio_metric_translations,
-- portfolio_gallery_items, portfolio_gallery_item_translations)
-- ============================================================

-- UP

CREATE TABLE portfolio_items (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug       VARCHAR(255)    NOT NULL,
    service_id BIGINT UNSIGNED NOT NULL,
    country_id BIGINT UNSIGNED NULL,
    year       SMALLINT UNSIGNED NOT NULL,
    gradient   VARCHAR(255)    NULL,
    is_featured BOOLEAN        NOT NULL DEFAULT FALSE,
    is_active  BOOLEAN         NOT NULL DEFAULT TRUE,
    sort_order INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX portfolio_items_slug_unique (slug),
    INDEX portfolio_items_service_id_index (service_id),
    INDEX portfolio_items_country_id_index (country_id),
    INDEX portfolio_items_year_index (year),
    CONSTRAINT portfolio_items_service_id_foreign
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE RESTRICT,
    CONSTRAINT portfolio_items_country_id_foreign
        FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE portfolio_translations (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    portfolio_item_id BIGINT UNSIGNED NOT NULL,
    locale            ENUM ('fa','en','tr','ru') NOT NULL,
    title             VARCHAR(255)    NOT NULL,
    summary           TEXT            NULL,
    challenge         TEXT            NULL,
    solution          TEXT            NULL,
    outcome           TEXT            NULL,
    route             VARCHAR(255)    NULL,
    created_at        TIMESTAMP NULL DEFAULT NULL,
    updated_at        TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX portfolio_translations_item_locale_unique (portfolio_item_id, locale),
    INDEX portfolio_translations_locale_index (locale),
    CONSTRAINT portfolio_translations_item_id_foreign
        FOREIGN KEY (portfolio_item_id) REFERENCES portfolio_items (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE portfolio_metrics (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    portfolio_item_id BIGINT UNSIGNED NOT NULL,
    value             VARCHAR(50)     NOT NULL,
    sort_order        INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at        TIMESTAMP NULL DEFAULT NULL,
    updated_at        TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX portfolio_metrics_item_id_index (portfolio_item_id),
    CONSTRAINT portfolio_metrics_item_id_foreign
        FOREIGN KEY (portfolio_item_id) REFERENCES portfolio_items (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE portfolio_metric_translations (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    metric_id  BIGINT UNSIGNED NOT NULL,
    locale     ENUM ('fa','en','tr','ru') NOT NULL,
    label      VARCHAR(255)    NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX pmet_metric_locale_unique (metric_id, locale),
    INDEX pmet_locale_index (locale),
    CONSTRAINT pmet_metric_id_foreign
        FOREIGN KEY (metric_id) REFERENCES portfolio_metrics (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE portfolio_gallery_items (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    portfolio_item_id BIGINT UNSIGNED NOT NULL,
    path              VARCHAR(255)    NULL,
    sort_order        INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at        TIMESTAMP NULL DEFAULT NULL,
    updated_at        TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX portfolio_gallery_item_id_index (portfolio_item_id),
    CONSTRAINT portfolio_gallery_item_id_foreign
        FOREIGN KEY (portfolio_item_id) REFERENCES portfolio_items (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE portfolio_gallery_item_translations (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    gallery_item_id BIGINT UNSIGNED NOT NULL,
    locale          ENUM ('fa','en','tr','ru') NOT NULL,
    alt             VARCHAR(255)    NULL,
    created_at      TIMESTAMP NULL DEFAULT NULL,
    updated_at      TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX pgit_item_locale_unique (gallery_item_id, locale),
    INDEX pgit_locale_index (locale),
    CONSTRAINT pgit_item_id_foreign
        FOREIGN KEY (gallery_item_id) REFERENCES portfolio_gallery_items (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS portfolio_gallery_item_translations;
DROP TABLE IF EXISTS portfolio_gallery_items;
DROP TABLE IF EXISTS portfolio_metric_translations;
DROP TABLE IF EXISTS portfolio_metrics;
DROP TABLE IF EXISTS portfolio_translations;
DROP TABLE IF EXISTS portfolio_items;
