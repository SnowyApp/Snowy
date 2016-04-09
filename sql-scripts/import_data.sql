COPY concept(id, effective_time, active, module_id, definition_status_id)
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

COPY language_refset(id, effective_time, active, module_id, refset_id, referenced_component_id, acceptability_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Refset/Language/der2_cRefset_LanguageFull-en_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY association_refset(id, effective_time, active, module_id, refset_id, referenced_component_id, target_component_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Refset/Content/der2_cRefset_AssociationReferenceFull_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY attribute_value_refset(id, effective_time, active, module_id, refset_id, referenced_component_id, value_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Refset/Content/der2_cRefset_AttributeValueFull_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY simple_refset(id, effective_time, active, module_id, refset_id, referenced_component_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Refset/Content/der2_Refset_SimpleFull_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');

COPY complex_map_refset(id, effective_time, active, module_id, refset_id,  referenced_component_id, map_group, map_priority, map_rule,  map_advice, map_target, correlation_id)
FROM '/Users/simon/Projects/browser/SnomedCT_RF2Release_INT_20150731/Full/Refset/Map/der2_iissscRefset_ComplexMapFull_INT_20150731.txt'
WITH (FORMAT csv, HEADER true, DELIMITER '	');
