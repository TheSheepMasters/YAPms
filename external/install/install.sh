#!/bin/bash

mkdir ../../public/app/www-data/ ../../public/app/www-data/maps/ ../../public/app/www-data/users/
chgrp www-data ../../public/app/www-data
chgrp www-data ../../public/app/www-data/maps
chgrp www-data ../../public/app/www-data/users
chmod g+w ../../public/app/www-data
chmod g+w ../../public/app/www-data/maps
chmod g+w ../../public/app/www-data/users

echo -n MySQL Password:
read -s password
mysql -u yapms -p$password -e "DROP DATABASE IF EXISTS yapms; CREATE DATABASE yapms;"
mysql -u yapms -p$password yapms < setup.sql
