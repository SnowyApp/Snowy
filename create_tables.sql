DROP TABLE IF EXISTS concepts CASCADE;
CREATE TABLE CONCEPTS(
    id VARCHAR(18) NOT NULL,
    effective_time VARCHAR(8) NOT NULL,
    active INTEGER NOT NULL,
    module_id VARCHAR(18) NOT NULL,
    definition_status_id VARCHAR(18) NOT NULL,
    CONSTRAINT concepts_pk PRIMARY KEY(id, effective_time, active)
);

DROP TABLE IF EXISTS description CASCADE;
CREATE TABLE description(
    id VARCHAR(18) NOT NULL,
    effective_time VARCHAR(8) NOT NULL,
    active INTEGER NOT NULL,
    module_id VARCHAR(18) NOT NULL,
    concept_id VARCHAR(18) NOT NULL,
    language_code VARCHAR(2) NOT NULL,
    type_id VARCHAR(18) NOT NULL,
    term VARCHAR(1024) NOT NULL,
    case_significance_id VARCHAR(18) NOT NULL,
    CONSTRAINT description_pk PRIMARY KEY(id, effective_time, active)
);

DROP TABLE IF EXISTS text_definition CASCADE;
CREATE TABLE text_definition(
    id VARCHAR(18) NOT NULL,
    effective_time VARCHAR(8) NOT NULL,
    active INTEGER NOT NULL,
    module_id VARCHAR(18) NOT NULL,
    concept_id VARCHAR(18) NOT NULL,
    language_code VARCHAR(2) NOT NULL,
    type_id VARCHAR(18) NOT NULL,
    term VARCHAR(1024) NOT NULL,
    case_significance_id VARCHAR(18) NOT NULL,
    CONSTRAINT text_definition_pk PRIMARY KEY(id, effective_time, active)
);


DROP TABLE IF EXISTS relationship CASCADE;
CREATE TABLE relationship(
    id VARCHAR(18) NOT NULL,
    effective_time VARCHAR(8) NOT NULL,
    active INTEGER NOT NULL,
    module_id VARCHAR(18) NOT NULL,
    source_id VARCHAR(18) NOT NULL,
    destination_id VARCHAR(18) NOT NULL,
    relationship_group VARCHAR(18) NOT NULL,
    type_id VARCHAR(18) NOT NULL,
    characteristic_type_id VARCHAR(18) NOT NULL,
    modifier_id VARCHAR(18) NOT NULL,
    CONSTRAINT relationship_pk PRIMARY KEY(id, effective_time, active)
);

DROP TABLE IF EXISTS stated_relationship cascade;
CREATE TABlE stated_relationship(
    id VARCHAR(18) NOT NULL,
    effective_time CHAR(8) NOT NULL,
    active INTEGER noT NULL,
    module_id VARCHAR(18) NOT NULL,
    source_id VARCHAR(18) NOT NULL,
    destination_id VARCHAR(18) NOT NULL,
    relationship_group VARCHAR(18) NOT NULL,
    type_id VARCHAR(18) NOT NULL,
    characteristic_type_id VARCHAR(18) NOT NULL,
    modifier_id VARCHAR(18) NOT NULL,
    CONSTRAINT stated_relationship_pk PRIMARY KEY(id, effective_time, active)
);

COPY concepts(id, effective_time, active, module_id, definition_status_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Terminology/sct2_Concept_Full_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY description(id, effective_time, active, module_id, concept_id, language_code, type_id, term, case_significance_id)
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
