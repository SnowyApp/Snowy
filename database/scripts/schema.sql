
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

