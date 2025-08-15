-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 05 juil. 2025 à 20:59
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cleandarna`
--

-- --------------------------------------------------------

--
-- Structure de la table `heros`
--

CREATE TABLE `heros` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title_fr` varchar(255) DEFAULT NULL,
  `title_ar` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `description_fr` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `cta_fr` varchar(255) DEFAULT NULL,
  `cta_ar` varchar(255) DEFAULT NULL,
  `cta_en` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `heros`
--

INSERT INTO `heros` (`id`, `title_fr`, `title_ar`, `title_en`, `description_fr`, `description_ar`, `description_en`, `cta_fr`, `cta_ar`, `cta_en`, `created_at`, `updated_at`) VALUES
(1, 'Nettoyez votre maison en toute simplicité avec DarnaClean', 'نظف منزلك ببساطة مع دارنا كلين', 'Clean your home easily with DarnaClean', 'Découvrez nos produits de nettoyage efficaces, naturels et à petits prix pour un intérieur toujours éclatant.', 'اكتشف منتجاتنا الفعالة والطبيعية بأسعار معقولة لمنزل متألق دائمًا.', 'Discover our effective, natural, and affordable cleaning products for a sparkling home.', 'Voir nos produits', 'عرض منتجاتنا', 'See our products', '2025-07-05 18:59:33', '2025-07-05 18:59:33'),
(2, 'Prenez soin de votre linge avec nos lessives de qualité', 'اعتنِ بملابسك مع مساحيق الغسيل عالية الجودة لدينا', 'Take care of your laundry with our quality detergents', 'Choisissez parmi une large gamme de lessives liquides, en poudre et adoucissants pour un linge propre et parfumé.', 'اختر من بين مجموعة واسعة من مساحيق الغسيل السائلة والمسحوقة والملينات لملابس نظيفة ومعطرة.', 'Choose from a wide range of liquid, powder detergents and softeners for clean and fragrant laundry.', 'Explorer la catégorie Lessive', 'استكشف فئة الغسيل', 'Explore Laundry category', '2025-07-05 18:59:33', '2025-07-05 18:59:33'),
(3, 'Hygiène personnelle au quotidien', 'النظافة الشخصية اليومية', 'Personal hygiene every day', 'Savons, gels douche et shampoings : tout ce dont vous avez besoin pour une routine de soins saine et agréable.', 'الصابون، جل الاستحمام والشامبو: كل ما تحتاجه لروتين عناية صحي وممتع.', 'Soaps, shower gels and shampoos: everything you need for a healthy and pleasant care routine.', 'Voir les produits d’hygiène', 'عرض منتجات النظافة', 'See hygiene products', '2025-07-05 18:59:33', '2025-07-05 18:59:33'),
(4, 'Désinfectez votre environnement facilement', 'قم بتعقيم بيئتك بسهولة', 'Disinfect your environment easily', 'Nos désinfectants éliminent 99,9% des bactéries. Pour une maison saine, protégez vos proches avec DarnaClean.', 'مطهراتنا تقضي على 99.9% من البكتيريا. لمنزل صحي، احمِ أحبائك مع دارنا كلين.', 'Our disinfectants kill 99.9% of bacteria. For a healthy home, protect your loved ones with DarnaClean.', 'Acheter des désinfectants', 'شراء المطهرات', 'Buy disinfectants', '2025-07-05 18:59:33', '2025-07-05 18:59:33');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `heros`
--
ALTER TABLE `heros`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `heros`
--
ALTER TABLE `heros`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
