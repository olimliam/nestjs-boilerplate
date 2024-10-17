create table samsung_ai_life_package
(
    id         bigint auto_increment
        primary key,
    name       varchar(255)              not null,
    image_url  varchar(2000)             null,
    description varchar(255)             null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp                 null
);

create table samsung_ai_life_package_log
(
    id               bigint auto_increment
        primary key,
    package_id       bigint                    null,
    package_media_id bigint                    null,
    type             varchar(255)              not null,
    api_url          varchar(2000)             not null,
    ip_address       varchar(255)              not null,
    device_type      varchar(255)              not null,
    created_at       timestamp default CURRENT_TIMESTAMP not null,
    updated_at       timestamp                 null
);

create table samsung_ai_life_package_media
(
    id         bigint auto_increment
        primary key,
    package_id bigint                    not null,
    type       varchar(255)              not null,
    title      varchar(255)              null,
    url        varchar(2000)             not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp                 null
);

create index samsung_ai_life_package_media_index_1
    on samsung_ai_life_package_media (package_id);

create table samsung_ai_life_package_statistics_past
(
    id               bigint auto_increment
        primary key,
    package_id       bigint                    null,
    package_media_id bigint                    null,
    type             varchar(255)              not null,
    click_count      int       default 1       not null,
    created_at       timestamp default CURRENT_TIMESTAMP not null,
    updated_at       timestamp                 null
);

create index samsung_ai_life_package_statistics_past_index_5
    on samsung_ai_life_package_statistics_past (created_at, package_id, package_media_id);

create table samsung_ai_life_package_statistics_today
(
    id               bigint auto_increment
        primary key,
    package_id       bigint                    null,
    package_media_id bigint                    null,
    type             varchar(255)              not null,
    click_count      int       default 1       not null,
    created_at       timestamp default CURRENT_TIMESTAMP not null,
    updated_at       timestamp                 null
);

create index samsung_ai_life_package_statistics_today_index_3
    on samsung_ai_life_package_statistics_today (package_id, package_media_id);

create table samsung_ai_life_product
(
    id         bigint auto_increment
        primary key,
    name       varchar(255)                             not null,
    description       varchar(255)                             null,
    image_url  varchar(2000)                            not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp
     default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create table samsung_ai_life_product_log
(
    id               bigint auto_increment
        primary key,
    product_id       bigint                                    null,
    product_media_id bigint                                    null,
    type             varchar(255)                              not null,
    api_url          varchar(255)                              not null,
    ip_address       varchar(255)                              not null,
    device_type      varchar(255)                              not null,
    created_at       timestamp default CURRENT_TIMESTAMP not null,
    updated_at       timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create index IDX_ad7ed0de8fe16cb6068f5e7afa
    on samsung_ai_life_product_log (created_at, product_id, product_media_id);

create table samsung_ai_life_product_media
(
    id                   bigint auto_increment
        primary key,
    type                 varchar(255)                             not null,
    title                varchar(255)                             not null,
    description          varchar(255)                             null,
    url                  varchar(2000)                            not null,
    card_mapped_media_id int                                      null,
    created_at           timestamp
     default CURRENT_TIMESTAMP not null,
    updated_at           timestamp
     default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    product_id           int                                      not null
);

create table samsung_ai_life_product_statistics_past
(
    id               bigint auto_increment
        primary key,
    product_id       bigint                                    null,
    product_media_id bigint                                    null,
    type             varchar(255)                              not null,
    click_count      int          default 1                    not null,
    created_at       timestamp default CURRENT_TIMESTAMP not null,
    updated_at       timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

create index IDX_2fc27417abcb4bff25833c27d0
    on samsung_ai_life_product_statistics_past (created_at, product_id, product_media_id);

create table samsung_ai_life_product_statistics_today
(
    id               bigint auto_increment
        primary key,
    type             varchar(255)                             not null,
    click_count      int         default 0                    not null,
    product_id       bigint                                   null,
    product_media_id bigint                                   null,
    created_at       timestamp
     default CURRENT_TIMESTAMP not null,
    updated_at       timestamp
     default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP
);

