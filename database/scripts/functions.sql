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

-- Create a new type that stores concept data
DROP TYPE IF EXISTS concept_result CASCADE;
CREATE TYPE concept_result AS (id BIGINT, full_term TEXT, syn_term TEXT, definition_status BIGINT, active INT);

-- Function that retrieves the concept with the given id
DROP FUNCTION IF EXISTS get_concept(BIGINT);
CREATE OR REPLACE FUNCTION get_concept(cid BIGINT)
RETURNS concept_result AS $$
DECLARE
    result concept_result;
    tmp BIGINT;
BEGIN
    SELECT definition_status_id, active INTO result.definition_status, result.active FROM concept WHERE id=cid;
    SELECT DISTINCT A.term, A.effective_time INTO result.full_term, tmp FROM description A join language_refset B ON A.id=B.referenced_component_id WHERE A.type_id=900000000000003001 AND A.concept_id=cid AND A.active=1 ORDER BY A.effective_time DESC LIMIT 1;

    SELECT DISTINCT A.term, A.effective_time INTO result.syn_term, tmp FROM description A join language_refset B ON A.id=B.referenced_component_id AND A.type_id=900000000000013009 WHERE A.concept_id=cid AND A.active=1 ORDER BY A.effective_time DESC LIMIT 1;
    result.id = cid;
    RETURN result;
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
