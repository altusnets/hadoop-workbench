ALTER TABLE FLUME_COMPONENT DROP FOREIGN KEY FLUME_COMPONENT_SERVICE_FK;
ALTER TABLE FLUME_COMPONENT ADD CONSTRAINT `FLUME_CLUSTER_FK` FOREIGN KEY (`PLATFORM_ID`, `CLUSTER_ID`) REFERENCES `CLUSTER` (`PLATFORM_ID`, `CLUSTER_ID`) ON DELETE CASCADE;
DROP TABLE CLUSTER_SERVICE;
