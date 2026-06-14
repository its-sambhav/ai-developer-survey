-- =========================================
-- Enable UUID generation
-- =========================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    google_sub VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================================
-- RESPONSES
-- =========================================

CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    q1 VARCHAR(100) NOT NULL,
    q2 JSONB NOT NULL,
    q3 JSONB NOT NULL,
    q4 TEXT NOT NULL,
    q5 TEXT NOT NULL,

    submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_response_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- AUDIT LOGS
-- =========================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    ip_address INET,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_responses_submitted_at
ON responses(submitted_at);

CREATE INDEX idx_audit_logs_user_id
ON audit_logs(user_id);

CREATE INDEX idx_audit_logs_created_at
ON audit_logs(created_at);