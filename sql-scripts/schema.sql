-- A table that stores the user data
DROP TABLE IF EXISTS usr CASCADE;
CREATE TABLE usr(
    email TEXT NOT NULL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    language VARCHAR(2),
    password_hash TEXT NOT NULL
);

-- A table that stores the tokens for logins
DROP TABLE IF EXISTS token CASCADE;
CREATE TABLE token(
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_email TEXT NOT NULL REFERENCES usr (email),
    accessed TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- A table that stores diagram for users
DROP TABLE IF EXISTS diagram CASCADE;
CREATE TABLE diagram(
    id BIGSERIAL PRIMARY KEY,
    data TEXT NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- A table that stores the description data
DROP TABLE IF EXISTS description CASCADE;
CREATE TABLE description(
    id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    concept_id BIGINT NOT NULL,
    language_code VARCHAR(2) NOT NULL,
    type_id BIGINT NOT NULL,
    term TEXT NOT NULL,
    case_significance_id BIGINT NOT NULL,
    CONSTRAINT description_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that stores the text_definition data
DROP TABLE IF EXISTS text_definition CASCADE;
CREATE TABLE text_definition(
    id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    concept_id BIGINT NOT NULL,
    language_code VARCHAR(2) NOT NULL,
    type_id BIGINT NOT NULL,
    term TEXT NOT NULL,
    case_significance_id BIGINT NOT NULL,
    CONSTRAINT text_definition_pk PRIMARY KEY(id, effective_time, active)
);


-- A table that stores the relationship data
DROP TABLE IF EXISTS relationship CASCADE;
CREATE TABLE relationship(
    id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    source_id BIGINT NOT NULL,
    destination_id BIGINT NOT NULL,
    relationship_group BIGINT NOT NULL,
    type_id BIGINT NOT NULL,
    characteristic_type_id BIGINT NOT NULL,
    modifier_id BIGINT NOT NULL,
    CONSTRAINT relationship_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that stores the stated relationship
DROP TABLE IF EXISTS stated_relationship cascade;
CREATE TABlE stated_relationship(
    id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER noT NULL,
    module_id BIGINT NOT NULL,
    source_id BIGINT NOT NULL,
    destination_id BIGINT NOT NULL,
    relationship_group BIGINT NOT NULL,
    type_id BIGINT NOT NULL,
    characteristic_type_id BIGINT NOT NULL,
    modifier_id BIGINT NOT NULL,
    CONSTRAINT stated_relationship_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that stores the language_refset
DROP TABLE IF EXISTS language_refset CASCADE;
CREATE TABLE language_refset(
    id UUID NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    refset_id BIGINT NOT NULL,
    referenced_component_id BIGINT NOT NULL,
    acceptability_id BIGINT NOT NULL,
    CONSTRAINT language_refset_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that stores the association refset
DROP TABLE IF EXISTS association_refset CASCADE;
CREATE TABLE association_refset(
    id UUID NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    refset_id BIGINT NOT NULL,
    referenced_component_id BIGINT NOT NULL,
    target_component_id BIGINT NOT NULL,
    CONSTRAINT association_refset_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that stores the attribute value refset
DROP TABLE IF EXISTS attribute_value_refset CASCADE;
CREATE TABLE attribute_value_refset(
    id UUID NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    refset_id BIGINT NOT NULL,
    referenced_component_id BIGINT NOT NULL,
    value_id BIGINT NOT NULL,
    CONSTRAINT attribute_value_refset_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that stores the simple refset
DROP TABLE IF EXISTS simple_refset CASCADE;
CREATE TABLE simple_refset(
    id UUID NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    refset_id BIGINT NOT NULL,
    referenced_component_id BIGINT NOT NULL,
    CONSTRAINT simple_refset_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that stores the complex map refset
DROP TABLE IF EXISTS complex_map_refset CASCADE;
CREATE TABLE complex_map_refset(
    id UUID NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    refset_id BIGINT NOT NULL,
    referenced_component_id BIGINT NOT NULL,
    map_group SMALLINT NOT NULL,
    map_priority SMALLINT NOT NULL,
    map_rule BIGINT,
    map_advice BIGINT,
    map_target VARCHAR(32),
    correlation_id BIGINT NOT NULL,
    CONSTRAINT complex_map_refset_pk PRIMARY KEY(id, effective_time, active)
);

-- A table that displays the favorite term relation
DROP TABLE IF EXISTS favorite_term CASCADE;
CREATE TABLE favorite_term(
    concept_id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    term TEXT NOT NULL,
    CONSTRAINT favorite_term_concept_fk 
        FOREIGN KEY (concept_id, effective_time, active) REFERENCES
        concept (id, effective_time, active),
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
    INSERT INTO favorite_term (concept_id, effective_time, active, user_email, term)
        VALUES (cid, latest_concept.effective_time, latest_concept.active, email, term);
END;
$$ LANGUAGE plpgsql;

-- Create a new type that stores concept data
DROP TYPE IF EXISTS concept_result CASCADE;
CREATE TYPE concept_result AS (id BIGINT, term TEXT);

DROP FUNCTION IF EXISTS get_concept(BIGINT);
CREATE OR REPLACE FUNCTION get_concept(cid BIGINT)
RETURNS concept_result AS $$
DECLARE
    result concept_result;
BEGIN
    SELECT concept_id, term INTO result
        FROM description
        WHERE concept_id=cid AND active = 1 
        ORDER BY effective_time DESC
        LIMIT 1;
    RETURN result;
END;
$$ LANGUAGE plpgsql;


-- Procedure that checks if a token is valid
DROP FUNCTION IF EXISTS is_valid_token(text, text);
CREATE OR REPLACE FUNCTION is_valid_token(token_info TEXT, email TEXT)
RETURNS INT AS $$
DECLARE
    result INT;
    token_id BIGINT;
BEGIN
    SELECT id INTO token_id FROM token WHERE token=token_info AND user_email=email;
    UPDATE token SET accessed = NOW() WHERE id=token_id;
    RETURN token_id;
END;
$$ LANGUAGE plpgsql;
