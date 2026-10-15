-- ============================================================
-- 000004: مدیران سیستم (admins)
-- ============================================================

-- UP

CREATE TABLE admins (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name          VARCHAR(255)    NOT NULL COMMENT 'نام',
    phone         VARCHAR(32)     NOT NULL COMMENT 'شماره موبایل',
    email         VARCHAR(255)    NOT NULL COMMENT 'ایمیل',
    password      VARCHAR(255)    NOT NULL COMMENT 'رمز ورود (Hash)',
    is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
    remember_token VARCHAR(100)   NULL,
    created_at    TIMESTAMP NULL DEFAULT NULL,
    updated_at    TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX admins_email_unique (email),
    UNIQUE INDEX admins_phone_unique (phone)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS admins;
