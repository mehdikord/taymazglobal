-- ============================================================
-- 000005: کاربران / مشتریان (users)
-- ============================================================

-- UP

CREATE TABLE users (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name              VARCHAR(255)    NOT NULL,
    email             VARCHAR(255)    NOT NULL,
    phone             VARCHAR(32)     NULL COMMENT 'ورود با موبایل',
    password          VARCHAR(255)    NOT NULL,
    company           VARCHAR(255)    NULL,
    country_id        BIGINT UNSIGNED NULL,
    is_active         BOOLEAN         NOT NULL DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    remember_token    VARCHAR(100)    NULL,
    created_at        TIMESTAMP NULL DEFAULT NULL,
    updated_at        TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX users_email_unique (email),
    UNIQUE INDEX users_phone_unique (phone),
    INDEX users_country_id_index (country_id),
    CONSTRAINT users_country_id_foreign
        FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS users;
