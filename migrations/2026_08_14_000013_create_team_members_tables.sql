-- ============================================================
-- 000013: اعضای تیم (team_members, team_member_translations)
-- ============================================================

-- UP

CREATE TABLE team_members (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    department  ENUM ('leadership','operations','customs','sales','logistics') NOT NULL,
    image_path  VARCHAR(255)    NULL,
    linkedin_url VARCHAR(255)   NULL,
    accent      VARCHAR(255)    NULL,
    sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NULL DEFAULT NULL,
    updated_at  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX team_members_department_index (department)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE team_member_translations (
    id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    team_member_id BIGINT UNSIGNED NOT NULL,
    locale         ENUM ('fa','en','tr','ru') NOT NULL,
    name           VARCHAR(255)    NOT NULL,
    role           VARCHAR(255)    NOT NULL,
    bio            TEXT            NULL,
    created_at     TIMESTAMP NULL DEFAULT NULL,
    updated_at     TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX tmt_member_locale_unique (team_member_id, locale),
    INDEX tmt_locale_index (locale),
    CONSTRAINT tmt_member_id_foreign
        FOREIGN KEY (team_member_id) REFERENCES team_members (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- DOWN

DROP TABLE IF EXISTS team_member_translations;
DROP TABLE IF EXISTS team_members;
