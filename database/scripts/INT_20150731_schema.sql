DROP TABLE IF EXISTS concept CASCADE;
CREATE TABLE concept(
    id BIGSERIAL PRIMARY KEY,
    concept_id BIGINT NOT NULL,
    definition_status_id BIGINT
);

DROP TABLE IF EXISTS relationship CASCADE;
CREATE TABLE relationship(
    destination_id BIGINT NOT NULL REFERENCES concept(id),
    group_id BIGINT NOT NULL,
    source_id BIGINT NOT NULL REFERENCES concept(id),
    type_id BIGINT NOT NULL REFERENCES concept(id),
    PRIMARY KEY (destination_id, source_id)
);

DROP TABLE IF EXISTS description CASCADE;
CREATE TABLE description(
    id BIGSERIAL PRIMARY KEY,
    concept_id BIGINT NOT NULL REFERENCES concept(id),
    term TEXT NOT NULL,
    type_id TEXT NOT NULL
);
