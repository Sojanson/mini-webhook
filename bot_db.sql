-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: messenger-bot-db
-- ------------------------------------------------------
-- Server version	5.7.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bot_categories`
--

DROP TABLE IF EXISTS `bot_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bot_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_categories`
--

LOCK TABLES `bot_categories` WRITE;
/*!40000 ALTER TABLE `bot_categories` DISABLE KEYS */;
INSERT INTO `bot_categories` VALUES (144896,'Nacional','group-nacional'),(144898,'Internacional','group-internacional'),(144899,'Economía','group-economia'),(144901,'Deporte','group-deportes'),(144902,'Ciencia y Tecnología','group-ciencia-y-tecnologia'),(144904,'Sociedad','group-sociedad'),(144905,'Artes y Cultura','group-artes-y-cultura'),(144906,'Espectáculos y TV','group-espectaculos-y-tv'),(144909,'Opinión','group-opinion'),(233937,'Vida Actual','group-vida-actual');
/*!40000 ALTER TABLE `bot_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bot_notas_enviadas`
--

DROP TABLE IF EXISTS `bot_notas_enviadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bot_notas_enviadas` (
  `id` int(16) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `link` text NOT NULL,
  `image_url` text NOT NULL,
  `description` text,
  `cat_id` int(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_notas_enviadas`
--

LOCK TABLES `bot_notas_enviadas` WRITE;
/*!40000 ALTER TABLE `bot_notas_enviadas` DISABLE KEYS */;
INSERT INTO `bot_notas_enviadas` VALUES (3142765,'esto es otra prueba del bots','http://bbcl.qa.biobiochile.cl/noticias/artes-y-cultura/musica/2018/08/02/esto-es-otra-prueba-del-bots.shtml','https://media.biobiochile.cl/wp-content/uploads/2018/05/shigeru-miyamoto-320x240.jpg','le descripzione diferente',144905);
/*!40000 ALTER TABLE `bot_notas_enviadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bot_user_category`
--

DROP TABLE IF EXISTS `bot_user_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bot_user_category` (
  `psid` bigint(40) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `subscribed` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`psid`,`cat_id`),
  KEY `fk_catid_categories` (`cat_id`),
  CONSTRAINT `fk_catid_categories` FOREIGN KEY (`cat_id`) REFERENCES `bot_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_psid_user` FOREIGN KEY (`psid`) REFERENCES `bot_users` (`psid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_user_category`
--

LOCK TABLES `bot_user_category` WRITE;
/*!40000 ALTER TABLE `bot_user_category` DISABLE KEYS */;
INSERT INTO `bot_user_category` VALUES (1978996648800406,144905,1);
/*!40000 ALTER TABLE `bot_user_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bot_users`
--

DROP TABLE IF EXISTS `bot_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bot_users` (
  `psid` bigint(40) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `last_name` varchar(60) DEFAULT NULL,
  `subscription_type` varchar(20) NOT NULL,
  PRIMARY KEY (`psid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_users`
--

LOCK TABLES `bot_users` WRITE;
/*!40000 ALTER TABLE `bot_users` DISABLE KEYS */;
INSERT INTO `bot_users` VALUES (1978996648800406,'Johann','Yucra Navarrete','daily');
/*!40000 ALTER TABLE `bot_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-03 15:39:39
