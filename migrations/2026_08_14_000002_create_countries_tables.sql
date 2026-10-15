-- ============================================================
-- 000002: کشورها (countries, country_translations)
-- ============================================================

-- UP

CREATE TABLE countries (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code       VARCHAR(2)      NOT NULL COMMENT 'ISO-3166 کد دوحرفی',
    is_active  BOOLEAN         NOT NULL DEFAULT TRUE,
    sort_order INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX countries_code_unique (code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE country_translations (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    country_id BIGINT UNSIGNED NOT NULL,
    locale     ENUM ('fa','en','tr','ru') NOT NULL,
    name       VARCHAR(255)    NOT NULL,
    region     VARCHAR(255)    NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX country_translations_country_locale_unique (country_id, locale),
    INDEX country_translations_locale_index (locale),
    CONSTRAINT country_translations_country_id_foreign
        FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS country_translations;
DROP TABLE IF EXISTS countries;
