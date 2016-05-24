-- A table that stores the user data
DROP TABLE IF EXISTS usr CASCADE;
CREATE TABLE usr(
    email TEXT NOT NULL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    db_edition TEXT,
    site_lang TEXT,
    password_hash TEXT NOT NULL
);

-- A table that stores the tokens for logins
DROP TABLE IF EXISTS token CASCADE;
CREATE TABLE token(
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_email TEXT NOT NULL REFERENCES usr (email) ON UPDATE CASCADE,
    accessed TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- A table that stores diagram for users
DROP TABLE IF EXISTS diagram CASCADE;
CREATE TABLE diagram(
    id BIGSERIAL PRIMARY KEY,
    data TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date_created TEXT NOT NULL,
    date_modified TEXT NOT NULL,
    user_email TEXT NOT NULL REFERENCES usr (email)
);

-- A table that displays the favorite term relation
DROP TABLE IF EXISTS favorite_term CASCADE;
CREATE TABLE favorite_term(
    concept_id BIGINT NOT NULL,
    user_email TEXT NOT NULL,
    date_added TEXT NOT NULL,
    term TEXT NOT NULL,
    CONSTRAINT favorite_term_user_pk PRIMARY KEY (concept_id, user_email),
    CONSTRAINT favorite_term_user_fk 
        FOREIGN KEY (user_email) REFERENCES usr (email)
);


-- Procedure that adds a favorite term for a user
CREATE OR REPLACE FUNCTION add_favorite_term(cid BIGINT, email TEXT, term TEXT) 
RETURNS void AS $$
DECLARE
	latest_concept RECORD;
BEGIN
    SELECT * FROM concept INTO latest_concept WHERE active=1 AND id=cid ORDER BY effective_time DESC LIMIT 1;
    INSERT INTO favorite_term (concept_id, user_email, term)
        VALUES (cid, email, term);
END;
$$ LANGUAGE plpgsql;


-- Procedure that checks if a token is valid
DROP FUNCTION IF EXISTS is_valid_token(text, text);
CREATE OR REPLACE FUNCTION is_valid_token(token_info TEXT, email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    token_id BIGINT;
BEGIN
    token_id = -1;
    SELECT token.id INTO token_id FROM token WHERE token=token_info AND user_email=email;
    UPDATE token SET accessed = NOW() WHERE id=token_id;
    IF (token_id != -1)
        THEN RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;
