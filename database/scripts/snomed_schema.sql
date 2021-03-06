DROP TABLE IF EXISTS concept CASCADE;
CREATE TABLE concept(
    id BIGINT NOT NULL PRIMARY KEY,
    definition_status_id BIGINT NOT NULL,
    preferred_full TEXT,
    preferred_synonym TEXT
);

DROP TABLE IF EXISTS relationship CASCADE;
CREATE TABLE relationship(
    destination_id BIGINT NOT NULL REFERENCES concept(id),
    group_id BIGINT NOT NULL,
    source_id BIGINT NOT NULL REFERENCES concept(id),
    type_id BIGINT NOT NULL REFERENCES concept(id),
    PRIMARY KEY (destination_id, source_id, type_id)
);

DROP TABLE IF EXISTS description CASCADE;
CREATE TABLE description(
    id BIGINT PRIMARY KEY,
    concept_id BIGINT NOT NULL REFERENCES concept(id),
    term TEXT NOT NULL,
    type_id TEXT NOT NULL,
    acceptability_id BIGINT NOT NULL
);
