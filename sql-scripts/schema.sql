DROP TABLE IF EXISTS usr CASCADE;
CREATE TABLE usr(
    email TEXT NOT NULL PRIMARY KEY,
    password_hash TEXT NOT NULL
);

DROP TABLE IF EXISTS token CASCADE;
CREATE TABLE token(
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_email TEXT NOT NULL REFERENCES usr (email)
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

DROP TABLE IF EXISTS favorite_term CASCADE;
CREATE TABLE favorite_term(
    concept_id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    date_added DATE NOT NULL,
    term_name TEXT NOT NULL,
    CONSTRAINT favorite_term_concept_fk 
        FOREIGN KEY (concept_id, effective_time, active) REFERENCES
        concept (id, effective_time, active),
    CONSTRAINT favorite_term_user_fk 
        FOREIGN KEY (user_email) REFERENCES usr (email)
);
