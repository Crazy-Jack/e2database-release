# System Info: Ubuntu 18.04 LTS x64


# Create a user with sudo previliage 
username="estrogene1"
sudo useradd $username
sudo passwd $username
sudo usermod -aG sudo $username
su $username
echo "Created Sudo User $username...!"

# Create MYSQL database
echo "\nInstalling MySQL..."
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql.service

# excecuting mysql 
sudo mysql -h localhost -u root -p < ./createdb.sql