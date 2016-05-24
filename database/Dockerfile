FROM postgres
ENV DB_NAME snomedct
ADD SnomedCT_RF2Release_INT_20150731 /sql-data/SnomedCT_RF2Release_INT_20150731 
ADD setup.sql /docker-entrypoint-initdb.d/
