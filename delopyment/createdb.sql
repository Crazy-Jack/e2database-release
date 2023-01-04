create database e2database;

grant all on e2database.* to 'myuser'@'%' identified by 'mypasswd';

create table mytable (
    id int not null auto_increment,
    myfield varchar(255) not null default ''
);


/* 

*/ 