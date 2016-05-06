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

COPY concept(id, effective_time, active, module_id, definition_status_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_Concept_Full_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY description(id, effective_time, active, module_id, concept_id, language_code, type_id, term, case_significance_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_Description_Full-en_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY text_definition(id, effective_time, active, module_id, concept_id, language_code, type_id, term, case_significance_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_TextDefinition_Full-en_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY relationship(id, effective_time, active, module_id, source_id, destination_id, relationship_group, type_id, characteristic_type_id, modifier_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_Relationship_Full_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY stated_relationship(id, effective_time, active, module_id, source_id, destination_id, relationship_group, type_id,  characteristic_type_id, modifier_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_StatedRelationship_Full_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY language_refset(id, effective_time, active, module_id, refset_id, referenced_component_id, acceptability_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Refset/Language/der2_cRefset_LanguageFull-en_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY association_refset(id, effective_time, active, module_id, refset_id, referenced_component_id, target_component_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Refset/Content/der2_cRefset_AssociationReferenceFull_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY attribute_value_refset(id, effective_time, active, module_id, refset_id, referenced_component_id, value_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Refset/Content/der2_cRefset_AttributeValueFull_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY simple_refset(id, effective_time, active, module_id, refset_id, referenced_component_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Refset/Content/der2_Refset_SimpleFull_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY complex_map_refset(id, effective_time, active, module_id, refset_id,  referenced_component_id, map_group, map_priority, map_rule,  map_advice, map_target, correlation_id)
FROM '/Users/simon/Projects/96tddd-code/database/SnomedCT_RF2Release_INT_20150731/Full/Refset/Map/der2_iissscRefset_ComplexMapFull_INT_20150731.txt'

WITH (FORMAT csv, HEADER true, DELIMITER '	');
