-- MySQL dump 10.13  Distrib 5.7.25, for macos10.14 (x86_64)
--
-- Host: localhost    Database: promise
-- ------------------------------------------------------
-- Server version	5.7.25

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
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique id of the item.',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of the client.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'System');
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique id of the item.',
  `client_id` int(10) unsigned NOT NULL COMMENT 'Client the item lives in.',
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The type if the item.',
  `item_id` int(10) unsigned NOT NULL COMMENT 'The id of the item the document is attached to.',
  `path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Path of the document below the item',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Stored name of the document',
  `mimetype` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mimetype as seen on upload',
  `size` int(11) NOT NULL COMMENT 'Size in bytes as seen on upload',
  `original` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Original filename',
  PRIMARY KEY (`id`),
  KEY `document_client_id_foreign` (`client_id`),
  CONSTRAINT `document_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Document metadata.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document`
--

LOCK TABLES `document` WRITE;
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
/*!40000 ALTER TABLE `document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listen`
--

DROP TABLE IF EXISTS `listen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listen` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique id of the item.',
  `client_id` int(10) unsigned NOT NULL COMMENT 'Client the item lives in.',
  `listener_id` int(10) unsigned NOT NULL COMMENT 'The user receiving notifications.',
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The type to listen on.',
  `item_id` int(10) unsigned DEFAULT NULL COMMENT 'The id of the item to listen on.',
  `operation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The operations of interest: CUD',
  PRIMARY KEY (`id`),
  KEY `listen_client_id_foreign` (`client_id`),
  CONSTRAINT `listen_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registrations of users for notifications.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listen`
--

LOCK TABLES `listen` WRITE;
/*!40000 ALTER TABLE `listen` DISABLE KEYS */;
/*!40000 ALTER TABLE `listen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique id of the item.',
  `client_id` int(10) unsigned NOT NULL COMMENT 'Client the item lives in.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int(10) unsigned NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` int(10) unsigned NOT NULL,
  `operation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `log_client_id_foreign` (`client_id`),
  CONSTRAINT `log_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='A log of all operations performed on items of all types';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2016_06_01_000001_create_oauth_auth_codes_table',1),(4,'2016_06_01_000002_create_oauth_access_tokens_table',1),(5,'2016_06_01_000003_create_oauth_refresh_tokens_table',1),(6,'2016_06_01_000004_create_oauth_clients_table',1),(7,'2016_06_01_000005_create_oauth_personal_access_clients_table',1),(8,'2019_04_22_181407_create_roles',1),(9,'2019_05_10_114034_create_log',1),(10,'2019_05_10_114034_create_notification',1),(11,'2019_06_12_094135_create_document',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique id of the item.',
  `client_id` int(10) unsigned NOT NULL COMMENT 'Client the item lives in.',
  `listener_id` int(10) unsigned NOT NULL COMMENT 'The user receiving the notification.',
  `user_id` int(10) unsigned NOT NULL COMMENT 'The user performing the operation.',
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The type operated on.',
  `item_id` int(10) unsigned NOT NULL COMMENT 'The id of the item operated on.',
  `operation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The operation to be notified about.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `notification_user_id_type_item_id_operation_unique` (`user_id`,`type`,`item_id`,`operation`),
  KEY `notification_client_id_foreign` (`client_id`),
  CONSTRAINT `notification_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User notification about an operation on an item.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_access_tokens`
--

DROP TABLE IF EXISTS `oauth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_access_tokens`
--

LOCK TABLES `oauth_access_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_access_tokens` DISABLE KEYS */;
INSERT INTO `oauth_access_tokens` VALUES ('01ea1ede03c68ba04f9cdc387981c29a015b8fa66e3fd2a1dd4391f4ee8993f757bd02e124a4471a',1,1,'Personal','[]',0,'2019-09-15 16:17:15','2019-09-15 16:17:15','2020-09-15 18:17:15'),('045c8a62dab30c04b7a08184b9c0032c3e98f06eb3f5aa5a01f399468bd4d78dd85686a3cc38b598',1,1,'Personal','[]',0,'2019-09-15 15:01:56','2019-09-15 15:01:56','2020-09-15 17:01:56'),('0bb372851c2c8c598683ee3039fba197ab245c73ed3925ae6aa643e70d32f68a6a3b41eb7c96352f',1,1,'Personal','[]',0,'2019-09-15 17:20:39','2019-09-15 17:20:39','2020-09-15 19:20:39'),('0edbbc7701a531862482ae8012ee310520cd266f3785151e152f4b2b54aa585a3849997ee3d3ffe7',1,1,'Personal','[]',0,'2019-09-15 16:25:48','2019-09-15 16:25:48','2020-09-15 18:25:48'),('0f95457e096d7385cc846cc40b5b162308f06eb697921b46d752136a8260c6ff8f452ba2369bda70',1,1,'Personal','[]',0,'2019-09-15 16:22:04','2019-09-15 16:22:04','2020-09-15 18:22:04'),('0fa4a070a2119354ada6e46613539410e0a26f57d25d723e35ffa3858c7974ce8f2ab898cfa80576',1,1,'Personal','[]',0,'2019-09-15 16:14:32','2019-09-15 16:14:32','2020-09-15 18:14:32'),('2cd84a85d8a82e0608c7ccf31dfe81b5387821f9cb120df70990e4512d712fd50d5f6267bf691a45',1,1,'Personal','[]',0,'2019-09-15 15:04:05','2019-09-15 15:04:05','2020-09-15 17:04:05'),('3455122fa4c182755cd4b1782ef2f0703b9d6578baaf7eaeed1a2b18325acf9542cf6c57d2cc6e8f',1,1,'Personal','[]',0,'2019-09-15 15:06:35','2019-09-15 15:06:35','2020-09-15 17:06:35'),('3ca9adacaee98c48b48bc044720c8e88ba97cbd9ae673c8417ba6f5d292362fb91e68404f58ed9e7',1,1,'Personal','[]',0,'2019-09-15 16:18:39','2019-09-15 16:18:39','2020-09-15 18:18:39'),('3daa44505ae58f5d823eb4ca44aaf98565969cca059bc7e24b3df0a2225204d2dca4208d92c12ca8',1,1,'Personal','[]',0,'2019-09-15 16:15:29','2019-09-15 16:15:29','2020-09-15 18:15:29'),('3f452c3757dca87db01e03045d0009db2b1c806a01287cdd6e07ec598f725d020fff952421dc36fd',1,1,'Personal','[]',0,'2019-09-15 16:11:49','2019-09-15 16:11:49','2020-09-15 18:11:49'),('3f7b8c55c4a968f97444de85b4cb8799a2dcc4eb56c9bf192b3066550b93c7fde6a9be6ad9b215b3',1,1,'Personal','[]',0,'2019-09-15 15:03:57','2019-09-15 15:03:57','2020-09-15 17:03:57'),('431df25644319787c480ba58c7a5a3870e004403faf1a75801c75ca90e18d1f4ea5e3457f55b6b51',1,1,'Personal','[]',0,'2019-09-15 15:03:59','2019-09-15 15:03:59','2020-09-15 17:03:59'),('4956b19ddcd1ae068915fa1610ddf9cb9ec9777fc427c8b296d2391f79814eca01058263afc6167b',1,1,'Personal','[]',0,'2019-09-15 16:17:08','2019-09-15 16:17:08','2020-09-15 18:17:08'),('4a586d94d8bcb08bbfc51a4b6ceca749018fd47c915632ae0d6af8178d293d434291f6c543cd7fcc',1,1,'Personal','[]',0,'2019-09-15 16:20:04','2019-09-15 16:20:04','2020-09-15 18:20:04'),('4c2cb63863baf9df9d6c6d245eab8070325114b451bf9d0fd472fca3e507d36c37b970e249875db8',1,1,'Personal','[]',0,'2019-09-15 16:16:38','2019-09-15 16:16:38','2020-09-15 18:16:38'),('532b86024e46e2c93700f2b5fdfcc54a8be2903799362e6cb81352d8317ad67fa8cefb0c5d668b57',1,1,'Personal','[]',0,'2019-09-15 16:17:41','2019-09-15 16:17:41','2020-09-15 18:17:41'),('595884a92454aacc6032d04eb779028bd641b649601a21ff4bed8c97841b020fdb9ad7b2183c7f94',1,1,'Personal','[]',0,'2019-09-15 16:23:48','2019-09-15 16:23:48','2020-09-15 18:23:48'),('64bce2e85bb9483c925ce79731ddfdef851379c8923df324ac8fc78ce2216d300968c29dafd1dd64',1,1,'Personal','[]',0,'2019-09-15 15:19:42','2019-09-15 15:19:42','2020-09-15 17:19:42'),('66324b9b0009203440c2f97dca3fd6d9f1340be7f4e24c1e49ae71ccb395bbdd279cf30a7cf8afa1',1,1,'Personal','[]',0,'2019-09-15 15:05:53','2019-09-15 15:05:53','2020-09-15 17:05:53'),('6c2a317f3d8bb39e9d90c8fe718b44feada05d6dabee43152f256ad0231d1e301acb527b7d4680a9',1,1,'Personal','[]',0,'2019-09-15 16:16:22','2019-09-15 16:16:22','2020-09-15 18:16:22'),('73663bcb9f2ac4d19600b65da9a2a13f830a3883eef74b05bbbd0cdf69de0717313b16ec66eb8592',1,1,'Personal','[]',0,'2019-09-15 16:17:10','2019-09-15 16:17:10','2020-09-15 18:17:10'),('825ffbf28ecccfbf6d11d123298ac461d73730c94b108cfd948ea062bcb1147ee894af34af932268',1,1,'Personal','[]',0,'2019-09-15 15:04:16','2019-09-15 15:04:16','2020-09-15 17:04:16'),('93c719b865c22cfb06726336f7137c46b309fe69940a179faab99bb390ce7d7a9e79f12eef7d458c',1,1,'Personal','[]',0,'2019-09-15 16:18:20','2019-09-15 16:18:20','2020-09-15 18:18:20'),('9a8420a5a40251dc27c5cc1f18574720fbba34dcb6321ccde8b824fdb0d9062814a4f88c0d3826af',1,1,'Personal','[]',0,'2019-09-15 15:02:15','2019-09-15 15:02:15','2020-09-15 17:02:15'),('9ee1bc7e8b4346b33bdfdc8c8f7f900be46605cc35b5da80fbaf42e0e122ab70af94b02fc5312a81',1,1,'Personal','[]',0,'2019-09-15 16:12:47','2019-09-15 16:12:47','2020-09-15 18:12:47'),('a0c1daaea3bb7c8f1aae344398cdc23cb21b55c926a387389752b1e4b2210d136436662ed31942fd',1,1,'Personal','[]',0,'2019-09-15 16:18:17','2019-09-15 16:18:17','2020-09-15 18:18:17'),('a98234c8ffb2dee7846cde6ab90d30506adfcb1a7f0a4fcd0fadb65a8840b57aac950d93adb597af',1,1,'Personal','[]',0,'2019-09-15 14:52:29','2019-09-15 14:52:29','2020-09-15 16:52:29'),('abab8df6d8ce1dfb9cb2138ace1981f43572dc97feaeed789675c176ddefd41ec2103e7eefe05821',1,1,'Personal','[]',0,'2019-09-15 15:16:00','2019-09-15 15:16:00','2020-09-15 17:16:00'),('b33f44d5c594fbff6708977a134cacd962591b3a9170fb5476f3acc5e7435d4729932e66006b9243',1,1,'Personal','[]',0,'2019-09-15 16:12:58','2019-09-15 16:12:58','2020-09-15 18:12:58'),('b496aa13e36892a19ac535e5a4ad99223b0e74721d74eb19023f445a8c4ab69b39fb06ef14f4fd2b',1,1,'Personal','[]',0,'2019-09-15 16:20:23','2019-09-15 16:20:23','2020-09-15 18:20:23'),('b621c10105fd4178838d4b0ce9520e2b98649b7ab37fe3528404c6486f4fa599e35cc96866a2e51c',1,1,'Personal','[]',0,'2019-09-15 15:04:44','2019-09-15 15:04:44','2020-09-15 17:04:44'),('b8bf900c181e0f6dbde276fcec809b110998be0e7dc932e487b1464a6b196cd42f9b355039b66304',1,1,'Personal','[]',0,'2019-09-15 15:04:03','2019-09-15 15:04:03','2020-09-15 17:04:03'),('bc5a0b104f733afad4fc9939c7d95a062ab671e639f3c3962e34ab097212f5aeba3a2dddd46d6863',1,1,'Personal','[]',0,'2019-09-15 15:06:52','2019-09-15 15:06:52','2020-09-15 17:06:52'),('d0daba119b87336edfca602015b5e043ccb261e6366f04c94b2dcc038e59c0f5b77039d95df069ef',1,1,'Personal','[]',0,'2019-09-15 17:21:21','2019-09-15 17:21:21','2020-09-15 19:21:21'),('da31bb3966dd649c4644d5a6c1966764406c29f6c3b7915425d4623e6e17a360b6ee11ca2b978e44',1,1,'Personal','[]',0,'2019-09-15 15:19:08','2019-09-15 15:19:08','2020-09-15 17:19:08'),('db35cd9e0508df0c6cf5152fddcb909201de3065622486f178581e838fdf0ebd22dc2280bcf24637',1,1,'Personal','[]',0,'2019-09-15 15:05:32','2019-09-15 15:05:32','2020-09-15 17:05:32'),('de9838d1ebf54e377e57bbd7ed7aeee2fd4e617976f38a91110e111acaf65df118add5ce985a0454',1,1,'Personal','[]',0,'2019-09-15 16:26:50','2019-09-15 16:26:50','2020-09-15 18:26:50'),('dec6991466c71dcddc2319f0553bc8de5b027f15ceca904692e68a53196b781dd024db2a868beb19',1,1,'Personal','[]',0,'2019-09-15 16:18:19','2019-09-15 16:18:19','2020-09-15 18:18:19'),('e2a0d1711d4e454b32341965b5e76b6788978f63d9498a9f2f96e63e91e45f0d2bfe631319c7124c',1,1,'Personal','[]',0,'2019-09-15 16:21:11','2019-09-15 16:21:11','2020-09-15 18:21:11'),('f60c21fe98cc427c89a099d52b82251492d34f87ff89895a86c9bf5f6ab41c394861f29b28cec41c',1,1,'Personal','[]',0,'2019-09-15 15:14:24','2019-09-15 15:14:24','2020-09-15 17:14:24'),('f74a95253c3519f5265fad7c00331ad4bc9d7f4edb7d7ca68e623a90f346638951d5edfdea20ec84',1,1,'Personal','[]',0,'2019-09-15 16:25:20','2019-09-15 16:25:20','2020-09-15 18:25:20'),('fc48487f977616eeb98c6a9e378e6ef183ff4e7afd3c12dfc84b75660738af4d2a6bb164f58d403d',1,1,'Personal','[]',0,'2019-09-15 15:03:37','2019-09-15 15:03:37','2020-09-15 17:03:37');
/*!40000 ALTER TABLE `oauth_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_auth_codes`
--

DROP TABLE IF EXISTS `oauth_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_auth_codes`
--

LOCK TABLES `oauth_auth_codes` WRITE;
/*!40000 ALTER TABLE `oauth_auth_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_auth_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_clients`
--

DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `redirect` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_clients`
--

LOCK TABLES `oauth_clients` WRITE;
/*!40000 ALTER TABLE `oauth_clients` DISABLE KEYS */;
INSERT INTO `oauth_clients` VALUES (1,NULL,'Laravel Personal Access Client','WONWmNmrTZLVqcvvvI7u3F74dt4QP9bRZ1K2OEKQ','http://localhost',1,0,0,'2019-09-15 13:20:23','2019-09-15 13:20:23');
/*!40000 ALTER TABLE `oauth_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_personal_access_clients`
--

DROP TABLE IF EXISTS `oauth_personal_access_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_personal_access_clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_personal_access_clients_client_id_index` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_personal_access_clients`
--

LOCK TABLES `oauth_personal_access_clients` WRITE;
/*!40000 ALTER TABLE `oauth_personal_access_clients` DISABLE KEYS */;
INSERT INTO `oauth_personal_access_clients` VALUES (1,1,'2019-09-15 13:20:23','2019-09-15 13:20:23');
/*!40000 ALTER TABLE `oauth_personal_access_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_refresh_tokens`
--

DROP TABLE IF EXISTS `oauth_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_refresh_tokens`
--

LOCK TABLES `oauth_refresh_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `right`
--

DROP TABLE IF EXISTS `right`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `right` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique id of the item.',
  `client_id` int(10) unsigned NOT NULL COMMENT 'Client the item lives in.',
  `role_id` int(10) unsigned NOT NULL COMMENT 'Role this right belongs to.',
  `tables` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Table names, comma seperated, or * this right acts upon.',
  `columns` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Column names, comma seperated, or * this right acts upon.',
  `where` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Row clause this right acts upon.',
  `actions` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Actions for this right, comma seperated, namely C,R,U and D or custom ones.',
  PRIMARY KEY (`id`),
  KEY `right_client_id_foreign` (`client_id`),
  KEY `right_role_id_foreign` (`role_id`),
  CONSTRAINT `right_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`),
  CONSTRAINT `right_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `right`
--

LOCK TABLES `right` WRITE;
/*!40000 ALTER TABLE `right` DISABLE KEYS */;
INSERT INTO `right` VALUES (1,1,1,'*','*','all','CRUD');
/*!40000 ALTER TABLE `right` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique id of the item.',
  `client_id` int(10) unsigned NOT NULL COMMENT 'Client the item lives in.',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of the role.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name_unique` (`name`),
  KEY `role_client_id_foreign` (`client_id`),
  CONSTRAINT `role_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,1,'Admin');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Unique id of the item.',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Free text name of the user.',
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'E-Mail of the user, also used for sign-in.',
  `email_verified_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp of email verification.',
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Password of the user.',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `client_id` int(10) unsigned NOT NULL COMMENT 'Client of the user.',
  `role_id` int(10) unsigned NOT NULL COMMENT 'Role of the user.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_client_id_foreign` (`client_id`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','joerg@joergviola.de',NULL,'$2y$10$jT.QsjvSb4/xAMZyof4VJuXmohu43/nsJARDYHNDgqSv8YR7Xx4oO',NULL,NULL,NULL,1,1);
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

-- Dump completed on 2019-09-15 21:54:48
