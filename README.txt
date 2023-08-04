#62: Fix "max_allowed_packet = 1MB" => "max_allowed_packet = 16MB" in MySQL xampp (Folder xampp/mysql/bin/my.init)
=> to increase the file size limit when store value of blob type, besides config more in node js server using {limit = ...mb}

#migrate db MySQL
npx sequelize-cli db:migrate