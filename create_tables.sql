DROP TABLE IF EXISTS usr CASCADE;
CREATE TABLE usr(
    email TEXT NOT NULL PRIMARY KEY,
    password_hash TEXT NOT NULL
);

DROP TABLE IF EXISTS token CASCADE;
CREATE TABLE token(
    id INTEGER PRIMARY KEY,
    token TEXT NOT NULL,
    user_email TEXT NOT NULL
);

DROP TABLE IF EXISTS concept CASCADE;
CREATE TABLE concept(
    id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    definition_status_id BIGINT NOT NULL,
    CONSTRAINT concept_pk PRIMARY KEY(id, effective_time, active)
);

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
