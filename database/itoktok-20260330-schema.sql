-- -------------------------------------------------------------
-- TablePlus 6.8.6(662)
--
-- https://tableplus.com/
--
-- Database: itoktok_db
-- Generation Time: 2026-03-30 02:13:08.8410
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `announcement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `is_important` tinyint(1) NOT NULL,
  `category` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `announcement_type` varchar(255) NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `centerdirector` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `role` enum('center_director','teacher') NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `position` varchar(255) NOT NULL,
  `mobile_number` varchar(255) NOT NULL,
  `office_number` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `signature_image` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `qualification_number` varchar(255) DEFAULT NULL,
  `receive_alerts` tinyint(1) NOT NULL,
  `receive_schedule_alerts` tinyint(1) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `centerinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `center_name` varchar(20) NOT NULL,
  `center_summary` varchar(100) NOT NULL,
  `center_introduce` varchar(255) NOT NULL,
  `center_export` varchar(50) NOT NULL,
  `center_addr` varchar(255) NOT NULL,
  `center_tel` varchar(15) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `clientinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consultant` varchar(20) NOT NULL DEFAULT '',
  `consultant_status` char(1) NOT NULL DEFAULT '1' COMMENT '1:진행,2:보류,3:종결',
  `client_name` varchar(30) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `tags` varchar(100) DEFAULT NULL,
  `memo` text DEFAULT NULL,
  `birth_date` varchar(15) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `email_address` varchar(50) DEFAULT NULL,
  `address_region` varchar(50) DEFAULT NULL,
  `address_city` varchar(50) DEFAULT NULL,
  `family_members` text DEFAULT NULL,
  `consultation_path` varchar(50) DEFAULT NULL,
  `center_username` varchar(20) NOT NULL,
  `registered_by` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `config` (
  `username` varchar(20) NOT NULL,
  `usercolor` varchar(10) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `birthdate` varchar(255) NOT NULL,
  `disability_type` varchar(255) NOT NULL,
  `disability_level` varchar(255) DEFAULT NULL,
  `contact` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `school` varchar(255) DEFAULT NULL,
  `initial_consultation_date` varchar(255) DEFAULT NULL,
  `first_visit_date` varchar(255) DEFAULT NULL,
  `member_number` varchar(255) DEFAULT NULL,
  `referral_path` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `inquiry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inquiry_type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `notice` (
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notice_type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `program` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '프로그램 고유 식별자',
  `program_name` varchar(50) NOT NULL COMMENT '프로그램명',
  `program_type` varchar(50) NOT NULL COMMENT '프로그램유형',
  `category` varchar(50) NOT NULL DEFAULT '' COMMENT '프로그램 카테고리(예: 상담, 교육, 치료 등)',
  `teacher_username` varchar(25) DEFAULT NULL COMMENT '담당 선생님 username',
  `description` text DEFAULT '' COMMENT '프로그램 상세 설명',
  `duration` int(11) DEFAULT 60 COMMENT '프로그램 진행 시간(분 단위, 기본 60분)',
  `max_participants` int(11) DEFAULT 1 COMMENT '프로그램 최대 참가 인원(기본 1명)',
  `price` decimal(10,2) DEFAULT 0.00 COMMENT '프로그램 비용(원 단위, 기본 0원)',
  `is_all_teachers` tinyint(1) DEFAULT 0 COMMENT '전체 선생님 선택 여부(TRUE: 전체선택, FALSE: 개별선택)',
  `is_active` tinyint(1) DEFAULT 1 COMMENT '프로그램 활성화 상태(TRUE: 활성, FALSE: 비활성)',
  `center_username` varchar(100) NOT NULL COMMENT '센터 계정 정보(centerinfo 테이블 참조)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '생성일시',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '수정일시',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '삭제일시(NULL: 미삭제)',
  PRIMARY KEY (`id`),
  KEY `idx_program_name` (`program_name`) COMMENT '프로그램명 검색 최적화',
  KEY `idx_program_type` (`program_type`) COMMENT '프로그램유형별 검색 최적화',
  KEY `idx_program_center` (`center_username`) COMMENT '센터별 프로그램 검색 최적화',
  KEY `idx_program_active` (`is_active`) COMMENT '활성 상태 기준 검색 최적화',
  KEY `idx_program_all_teachers` (`is_all_teachers`) COMMENT '전체 선생님 선택 여부 검색 최적화'
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='프로그램 관리 마스터 테이블';

CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  `consultation_content` varchar(255) DEFAULT NULL,
  `record_content` varchar(255) DEFAULT NULL,
  `special_notes` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_username` varchar(20) NOT NULL,
  `client_id` int(11) NOT NULL,
  `schedule_type` tinyint(1) unsigned DEFAULT 1 COMMENT '일정 유형: 1(재활), 2(상담/평가), 3(기타)',
  `start_date` date DEFAULT curdate(),
  `finish_date` date DEFAULT curdate(),
  `start_time` varchar(5) NOT NULL,
  `finish_time` varchar(5) NOT NULL,
  `repeat_type` int(11) NOT NULL DEFAULT 1 COMMENT '반복 유형: 1(매일), 2(매주), 3(매월)',
  `repeat_days` text DEFAULT NULL COMMENT '반복 요일 지정: 매주 반복일 경우 사용',
  `created_by` varchar(20) DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_schedule_teacher_username` (`teacher_username`),
  KEY `idx_schedule_client_id` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `schedulelist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `teacher_username` varchar(20) NOT NULL,
  `client_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL COMMENT '프로그램 ID',
  `schedule_date` date NOT NULL,
  `schedule_time` varchar(5) NOT NULL,
  `schedule_finish_time` varchar(5) NOT NULL,
  `schedule_status` enum('1','2','3','4','5') NOT NULL COMMENT '1:예약,2:완료,3:취소,4:노쇼,5:보류',
  `schedule_memo` varchar(255) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `schedule_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  KEY `idx_schedulelist_date` (`schedule_date`),
  KEY `idx_schedulelist_program` (`program_id`),
  KEY `schedulelist_ibfk_3` (`client_id`),
  KEY `schedulelist_ibfk_4` (`teacher_username`),
  CONSTRAINT `schedulelist_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`id`),
  CONSTRAINT `schedulelist_ibfk_2` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`),
  CONSTRAINT `schedulelist_ibfk_3` FOREIGN KEY (`client_id`) REFERENCES `clientinfo` (`id`),
  CONSTRAINT `schedulelist_ibfk_4` FOREIGN KEY (`teacher_username`) REFERENCES `user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6643 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `teacher` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `role` enum('center_director','teacher') NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `position` varchar(255) NOT NULL,
  `mobile_number` varchar(255) NOT NULL,
  `office_number` varchar(255) DEFAULT NULL,
  `birthdate` varchar(255) DEFAULT NULL,
  `teacher_role` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `full_name` varchar(30) NOT NULL,
  `birth_date` varchar(15) NOT NULL,
  `zip_code` varchar(7) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address_extra` varchar(255) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `hp_number` varchar(15) DEFAULT NULL,
  `user_type` char(1) DEFAULT NULL,
  `center_username` varchar(20) NOT NULL DEFAULT '' COMMENT '소속센터',
  `is_active` tinyint(1) DEFAULT NULL,
  `is_superuser` tinyint(1) DEFAULT NULL,
  `usercolor` varchar(10) NOT NULL DEFAULT '#a668e3',
  `expertise` varchar(30) NOT NULL DEFAULT '',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_user_username` (`username`),
  KEY `ix_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user_search_selected_teacher` (
  `username` varchar(20) NOT NULL,
  `selected_teacher` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `voucher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `support_amount` float NOT NULL,
  `personal_contribution` float NOT NULL,
  `status` varchar(255) NOT NULL,
  `social_welfare_service_number` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;