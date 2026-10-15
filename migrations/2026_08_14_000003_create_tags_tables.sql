-- ============================================================
-- 000003: تگ‌ها (tags, tag_translations)
-- ============================================================

-- UP

CREATE TABLE tags (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug       VARCHAR(255)    NOT NULL,
    is_active  BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX tags_slug_unique (slug)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE tag_translations (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tag_id     BIGINT UNSIGNED NOT NULL,
    locale     ENUM ('fa','en','tr','ru') NOT NULL,
    name       VARCHAR(255)    NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX tag_translations_tag_locale_unique (tag_id, locale),
    INDEX tag_translations_locale_index (locale),
    CONSTRAINT tag_translations_tag_id_foreign
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS tag_translations;
DROP TABLE IF EXISTS tags;
