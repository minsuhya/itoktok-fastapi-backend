-- 테이블 itoktok_db.schedule: schedulelist 에 대한 그룹핑 정보
CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 itoktok_db.schedulelist: schedule 에 대한 일일 일정 정보
CREATE TABLE IF NOT EXISTS `schedulelist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `teacher_username` varchar(20) NOT NULL,
  `client_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL COMMENT '프로그램 ID',
  `schedule_date` date NOT NULL,
  `schedule_time` varchar(5) NOT NULL,
  `schedule_status` varchar(1) NOT NULL,
  `schedule_memo` varchar(255) NOT NULL,
  `created_by` varchar(20) DEFAULT NULL,
  `updated_by` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `schedule_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `schedulelist_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=283 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

