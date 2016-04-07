DROP TABLE IF EXISTS concepts CASCADE;
CREATE TABLE CONCEPTS(
  id VARCHAR(18) NOT NULL,
  effective_time VARCHAR(8) NOT NULL,
  active INTEGER(1) NOT NULL,
  module_id VARCHAR(18) NOT NULL,
  definition_status_id VARCHAR(18) NOT NULL,
  CONSTRAINT concepts_pk PRIMARY KEY(id, effectivetime, active)
);

DROP TABLE IF EXISTS description CASCADE;
CREATE TABLE DESCRIPTION(
  id VARCHAR(18) NOT NULL,
  effective_time VARCHAR(8) NOT NULL,
  active INTEGER NOT NULL,
  module_id VARCHAR(18) NOT NULL,
  concept_id VARCHAR(18) NOT NULL,
  language_code VARCHAR(2) NOT NULL,
  type_id VARCHAR(18) NOT NULL,
  term VARCHAR(255) NOT NULL,
  case_significance_id VARCHAR(18) NOT NULL,
  CONSTRAINT description_pk PRIMARY KEY(id, effectivetime, active)
);

DROP TABLE IF EXISTS text_definition CASCADE;
CREATE TABLE TEXT_DEFINITION(
  id VARCHAR(18) NOT NULL,
  effective_time VARCHAR(8) NOT NULL,
  active INTEGER NOT NULL,
  module_id VARCHAR(18) NOT NULL,
  concept_id VARCHAR(18) NOT NULL,
  language_code VARCHAR(2) NOT NULL,
  type_id VARCHAR(18) NOT NULL,
  term VARCHAR(255) NOT NULL,
  case_significance_id VARCHAR(18) NOT NULL,
  CONSTRAINT description_pk PRIMARY KEY(id, effectivetime, active)
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
