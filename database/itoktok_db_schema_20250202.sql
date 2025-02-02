-- --------------------------------------------------------
-- 호스트:                          13.125.43.125
-- 서버 버전:                        10.11.6-MariaDB-log - managed by https://aws.amazon.com/rds/
-- 서버 OS:                        Linux
-- HeidiSQL 버전:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 itoktok_db.centerdirector 구조 내보내기
CREATE TABLE IF NOT EXISTS `centerdirector` (
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

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.centerinfo 구조 내보내기
CREATE TABLE IF NOT EXISTS `centerinfo` (
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.clientinfo 구조 내보내기
CREATE TABLE IF NOT EXISTS `clientinfo` (
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
  `register` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.config 구조 내보내기
CREATE TABLE IF NOT EXISTS `config` (
  `username` varchar(20) NOT NULL,
  `usercolor` varchar(10) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.notice 구조 내보내기
CREATE TABLE IF NOT EXISTS `notice` (
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

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.program 구조 내보내기
CREATE TABLE IF NOT EXISTS `program` (
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='프로그램 관리 마스터 테이블';

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.schedule 구조 내보내기
CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_username` varchar(20) NOT NULL,
  `client_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `program_id` int(11) NOT NULL COMMENT '프로그램 ID',
  `start_date` date DEFAULT curdate(),
  `finish_date` date DEFAULT curdate(),
  `start_time` varchar(5) NOT NULL,
  `finish_time` varchar(5) NOT NULL,
  `repeat_type` int(11) NOT NULL DEFAULT 1 COMMENT '반복 유형: 1(매일), 2(매주), 3(매월)',
  `repeat_days` text DEFAULT NULL COMMENT '반복 요일 지정: 매주 반복일 경우 사용',
  `memo` varchar(255) DEFAULT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_schedule_teacher_username` (`teacher_username`),
  KEY `idx_schedule_client_id` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.schedulelist 구조 내보내기
CREATE TABLE IF NOT EXISTS `schedulelist` (
  `schedule_date` date NOT NULL,
  `schedule_time` varchar(5) NOT NULL,
  `schedule_status` varchar(1) NOT NULL,
  `schedule_memo` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `schedule_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `schedulelist_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=283 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.teacher 구조 내보내기
CREATE TABLE IF NOT EXISTS `teacher` (
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

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usercolor` varchar(10) NOT NULL DEFAULT '#a668e3',
  `expertise` varchar(30) NOT NULL DEFAULT '',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_user_username` (`username`),
  KEY `ix_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 itoktok_db.voucher 구조 내보내기
CREATE TABLE IF NOT EXISTS `voucher` (
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

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
