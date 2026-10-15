-- ============================================================
-- 000009: خدمات (services, service_translations, service_country, service_tag)
-- ============================================================

-- UP

CREATE TABLE services (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug        VARCHAR(255)    NOT NULL,
    icon        VARCHAR(50)     NOT NULL COMMENT 'کلید آیکون',
    is_featured BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NULL DEFAULT NULL,
    updated_at  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX services_slug_unique (slug)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE service_translations (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    service_id  BIGINT UNSIGNED NOT NULL,
    locale      ENUM ('fa','en','tr','ru') NOT NULL,
    title       VARCHAR(255)    NOT NULL,
    summary     TEXT            NULL,
    description TEXT            NULL,
    benefits    JSON            NULL,
    steps       JSON            NULL,
    faq         JSON            NULL,
    created_at  TIMESTAMP NULL DEFAULT NULL,
    updated_at  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX service_translations_service_locale_unique (service_id, locale),
    INDEX service_translations_locale_index (locale),
    CONSTRAINT service_translations_service_id_foreign
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE service_country (
    service_id BIGINT UNSIGNED NOT NULL,
    country_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (service_id, country_id),
    INDEX service_country_country_id_index (country_id),
    CONSTRAINT service_country_service_id_foreign
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE,
    CONSTRAINT service_country_country_id_foreign
        FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE service_tag (
    service_id BIGINT UNSIGNED NOT NULL,
    tag_id     BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (service_id, tag_id),
    INDEX service_tag_tag_id_index (tag_id),
    CONSTRAINT service_tag_service_id_foreign
        FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE,
    CONSTRAINT service_tag_tag_id_foreign
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS service_tag;
DROP TABLE IF EXISTS service_country;
DROP TABLE IF EXISTS service_translations;
DROP TABLE IF EXISTS services;
