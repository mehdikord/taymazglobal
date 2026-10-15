-- ============================================================
-- 000007: نشست‌های کاربری (sessions)
-- ============================================================

-- UP

CREATE TABLE sessions (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    session_id    VARCHAR(255)    NOT NULL,
    user_id       BIGINT UNSIGNED NULL,
    ip_address    VARCHAR(45)     NULL,
    user_agent    TEXT            NULL,
    payload       LONGTEXT        NOT NULL,
    last_activity INT UNSIGNED    NOT NULL,
    created_at    TIMESTAMP NULL DEFAULT NULL,
    updated_at    TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX sessions_session_id_unique (session_id),
    INDEX sessions_user_id_index (user_id),
    INDEX sessions_last_activity_index (last_activity),
    CONSTRAINT sessions_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS sessions;
