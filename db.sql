-- Creating Database
create database project;
use project;
create table program(
program_id int primary key auto_increment,
 program_name varchar(20)
);
create table branch(
branch_id int primary key auto_increment,
 branch_name varchar(30),
 program_id int,
 foreign key(program_id) references program(program_id)
);
create table semester(
semester_id int primary key auto_increment,
 semester_no int,
 branch_id int,
 foreign key(branch_id) references branch(branch_id)
);
create table subjects(
subject_id int primary key auto_increment,
 subject_name varchar(30),
 semester_id int,
 foreign key(semester_id) references semester(semester_id)
);
create table topics(
topic_id int primary key auto_increment,
 topic_name varchar(40),
 subject_id int,
 foreign key(subject_id) references subjects(subject_id)
);
create table student(
student_id int primary key auto_increment,
 student_name varchar(50),
 enrollment_no varchar(10) unique,
 program_id int,
 branch_id int,
 foreign key(program_id) references program(program_id),
foreign key(branch_id) references branch(branch_id)
);
create table internship(
internship_id int primary key auto_increment,
 student_id int,
 company_name varchar(50),
 internship_description text,
 foreign key(student_id) references student(student_id)
);
create table applications(
application_id int primary key auto_increment,
 internship_id int,
 topic_id int,
 FOREIGN KEY(internship_id) REFERENCES internship(internship_id) ON DELETE CASCADE,
 foreign key(topic_id) references topics(topic_id)
);
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  pass VARCHAR(10) NOT NULL,
  user_type VARCHAR(7) CHECK (user_type IN ('faculty', 'student'))
);

select * from internship;

INSERT INTO program (program_name)
VALUES 
('B.Tech'),
('M.Tech');

INSERT INTO branch (branch_name, program_id)
VALUES 
('Computer Engineering', 1),
('Information Technology', 1),
('Artificial Intelligence', 1),
('Data Science', 2);

INSERT INTO semester (semester_no, branch_id)
VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 3),
(6, 4);

INSERT INTO subjects (subject_name, semester_id)
VALUES
('Database Management Systems', 3),
('Computer Networks', 3),
('Operating Systems', 2),
('Artificial Intelligence', 5),
('Machine Learning', 6);

INSERT INTO topics (topic_name, subject_id)
VALUES
('Normalization and ER Diagrams', 1),
('SQL Queries and Joins', 1),
('Routing Algorithms', 2),
('Process Scheduling', 3),
('Search Algorithms', 4),
('Supervised Learning', 5);

INSERT INTO student (student_name, enrollment_no, program_id, branch_id)
VALUES
('Dhruvil Bhalodi', '23bt04010', 1, 1),
('Khushi Khunt', '23bt04058', 1, 1),
('Dev Patel', '23bt04093', 1, 2),
('Mahek', '23bt04146', 1, 3);

INSERT INTO internship (student_id, company_name, internship_description)
VALUES
(1, 'TechNova Solutions', 'Worked on database design and backend integration.'),
(2, 'NetLink Systems', 'Developed a small-scale network monitoring system.'),
(3, 'AI Innovations', 'Built a chatbot using NLP techniques.'),
(4, 'DataNext Labs', 'Created ML models for image classification.');

INSERT INTO applications (internship_id, topic_id)
VALUES
(5, 1),
(5, 2),
(2, 3),
(3, 5),
(4, 6);

INSERT INTO users (user_name, email, pass, user_type)
VALUES
('Professor', 'prof@gmail.com', 'pf', 'faculty'),
('Dhruvil Bhalodi', 'dhruvil@gmail.com', '10', 'student'),
('Khushi Khunt', 'khushigmail.com', '58', 'student'),
('Dev Patel', 'dev@gmail.com', '93', 'student'),
('Mahek', 'mahek@gmail.com', '146', 'student');

SELECT * FROM program;
SELECT * FROM branch;
SELECT * FROM semester;
SELECT * FROM subjects;
SELECT * FROM topics;
SELECT * FROM student;
SELECT * FROM internship;
SELECT * FROM applications;
SELECT * FROM users;
