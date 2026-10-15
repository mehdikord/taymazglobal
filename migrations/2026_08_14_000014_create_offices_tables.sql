-- ============================================================
-- 000014: دفاتر (offices, office_translations)
-- ============================================================

-- UP

CREATE TABLE offices (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    country_id     BIGINT UNSIGNED NULL,
    phone          VARCHAR(32)     NOT NULL,
    email          VARCHAR(255)    NOT NULL,
    is_head_office BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active      BOOLEAN         NOT NULL DEFAULT TRUE,
    sort_order     INT UNSIGNED    NOT NULL DEFAULT 0,
    created_at     TIMESTAMP NULL DEFAULT NULL,
    updated_at     TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX offices_country_id_index (country_id),
    CONSTRAINT offices_country_id_foreign
        FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE office_translations (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    office_id  BIGINT UNSIGNED NOT NULL,
    locale     ENUM ('fa','en','tr','ru') NOT NULL,
    city       VARCHAR(255)    NOT NULL,
    address    TEXT            NULL,
    hours      VARCHAR(255)    NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX office_translations_office_locale_unique (office_id, locale),
    INDEX office_translations_locale_index (locale),
    CONSTRAINT office_translations_office_id_foreign
        FOREIGN KEY (office_id) REFERENCES offices (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS office_translations;
DROP TABLE IF EXISTS offices;
