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
    date_created TEXT NOT NULL,
    date_modified TEXT NOT NULL,
    user_email TEXT NOT NULL REFERENCES usr (email)
);


-- A table that stores the concept data
DROP TABLE IF EXISTS concept CASCADE;
CREATE TABLE concept(
    id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    definition_status_id BIGINT NOT NULL,
    CONSTRAINT concept_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that displays the favorite term relation
DROP TABLE IF EXISTS favorite_term CASCADE;
CREATE TABLE favorite_term(
    concept_id BIGINT NOT NULL,
    user_email TEXT NOT NULL,
    date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    term TEXT NOT NULL,
    CONSTRAINT favorite_term_user_pk PRIMARY KEY (concept_id, user_email),
    CONSTRAINT favorite_term_user_fk 
        FOREIGN KEY (user_email) REFERENCES usr (email)
);

