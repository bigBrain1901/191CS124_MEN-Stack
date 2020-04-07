-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: irisrec
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creatorid` int DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(500) NOT NULL,
  `starting_bid` int NOT NULL,
  `deadline` date NOT NULL,
  `contact` bigint DEFAULT NULL,
  `image` varchar(10000) NOT NULL,
  `current_bid` int DEFAULT '0',
  `highest_bidder` int DEFAULT '0',
  `status` enum('Y','N') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `highest_bidder` (`highest_bidder`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`highest_bidder`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (49,102,'A Computer','Hey, this is the best deal you will get for 8GB ram and 250GB SSD! It is 2 years old...',50000,'2020-04-23',0,'image-1586231020044.png',60001,104,'N'),(50,102,'Bananas','These bananas are top of the class, legendary stuff! You will love these like minions!',50,'2020-04-01',0,'image-1586231112313.jpg',60,103,'Y'),(51,104,'Ludo Board','Are you tired of seeing Insta stories about Ludo. Get one for yourself, now!!!',50,'2020-04-08',0,'image-1586231201440.jfif',0,102,'N'),(52,103,'Old Apple','This apple is a 50 year old heritage and calls you to buy it. Hurry or you\'ll miss it!!',60,'2020-04-03',0,'image-1586231295210.jpg',61,102,'N');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rno` varchar(8) NOT NULL,
  `name` varchar(100) NOT NULL,
  `doj` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pwd` varchar(10000) NOT NULL,
  `pno` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rno` (`rno`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (102,'1','Ishaan Singh','2020-04-07 03:38:40','81dc9bdb52d04dc20036dbd8313ed055',9739492999),(103,'2','Aditya Shukla','2020-04-07 03:39:30','81dc9bdb52d04dc20036dbd8313ed055',9876543210),(104,'3','Rahul Dua','2020-04-07 03:40:12','81dc9bdb52d04dc20036dbd8313ed055',8876655321);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-07 10:01:39
