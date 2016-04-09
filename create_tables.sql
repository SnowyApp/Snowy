DROP TABLE IF EXISTS concepts CASCADE;
CREATE TABLE CONCEPTS(
    id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    definition_status_id BIGINT NOT NULL,
    CONSTRAINT concepts_pk PRIMARY KEY(id, effective_time, active)
);

DROP TABLE IF EXISTS descriptions CASCADE;
CREATE TABLE descriptions(
    id BIGINT NOT NULL,
    effective_time BIGINT NOT NULL,
    active INTEGER NOT NULL,
    module_id BIGINT NOT NULL,
    concept_id BIGINT NOT NULL,
    language_code VARCHAR(2) NOT NULL,
    type_id BIGINT NOT NULL,
    term VARCHAR(1024) NOT NULL,
    case_significance_id BIGINT NOT NULL,
    CONSTRAINT descriptions_pk PRIMARY KEY(id, effective_time, active)
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
    term VARCHAR(1024) NOT NULL,
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

COPY concepts(id, effective_time, active, module_id, definition_status_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_Concept_Full_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY descriptions(id, effective_time, active, module_id, concept_id, language_code, type_id, term, case_significance_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_Description_Full-en_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY text_definition(id, effective_time, active, module_id, concept_id, language_code, type_id, term, case_significance_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_TextDefinition_Full-en_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY relationship(id, effective_time, active, module_id, source_id, destination_id, relationship_group, type_id, characteristic_type_id, modifier_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_Relationship_Full_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY stated_relationship(id, effective_time, active, module_id, source_id, destination_id, relationship_group, type_id,  characteristic_type_id, modifier_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_StatedRelationship_Full_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');
