-- 패키지 생성 후 오늘 패키지 통계 테이블에 데이터 생성
DELIMITER //

CREATE TRIGGER after_package_insert
    AFTER INSERT
    ON `samsung-ai-life`.samsung_ai_life_package
    FOR EACH ROW
BEGIN
    INSERT INTO `samsung-ai-life`.samsung_ai_life_package_statistics_today (package_id,
                                                                            type,
                                                                            created_at)
    VALUES (NEW.id,
            'package',
            NOW());
END //

DELIMITER ;

-- 패키지 미디어 생성 후 오늘 패키지 통계 테이블에 데이터 생성
DELIMITER //

CREATE TRIGGER after_package_media_insert
    AFTER INSERT
    ON `samsung-ai-life`.samsung_ai_life_package_media
    FOR EACH ROW
BEGIN
    IF NEW.type = 'video' THEN
        INSERT INTO `samsung-ai-life`.samsung_ai_life_package_statistics_today (package_id,
                                                                                package_media_id,
                                                                                type,
                                                                                created_at)
        VALUES (NEW.package_id,
                NEW.id,
                'video',
                NOW());
    END IF;
END //

DELIMITER ;

-- 제품 생성 후 오늘 패키지 통계 테이블에 데이터 생성
DELIMITER //

CREATE TRIGGER after_product_insert
    AFTER INSERT
    ON `samsung-ai-life`.samsung_ai_life_product
    FOR EACH ROW
BEGIN
    INSERT INTO `samsung-ai-life`.samsung_ai_life_product_statistics_today (product_id,
                                                                            type,
                                                                            created_at)
    VALUES (NEW.id,
            'product',
            NOW());
END //

DELIMITER ;

-- 제품 미디어 중 동영상 데이터 생성 후 오늘 패키지 통계 테이블에 데이터 생성
DELIMITER //

CREATE TRIGGER after_product_media_insert
    AFTER INSERT
    ON `samsung-ai-life`.samsung_ai_life_product_media
    FOR EACH ROW
BEGIN
    IF NEW.type = 'video' THEN
        INSERT INTO `samsung-ai-life`.samsung_ai_life_product_statistics_today (type,
                                                                                product_id,
                                                                                product_media_id,
                                                                                created_at)
        VALUES (NEW.type,
                NEW.product_id,
                NEW.id,
                NOW());
    END IF;
END //

DELIMITER ;