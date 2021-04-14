Vagrant.configure("2") do |config|
    config.vm.box = "bento/ubuntu-18.04"
    config.vm.network "forwarded_port", guest: 3000, host: 3000
    config.vm.provision "shell", inline: <<-SCRIPT
        apt-get update
        sudo apt -y install mc curl dirmngr apt-transport-https lsb-release ca-certificates
        curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
        apt-get install -y nodejs
    SCRIPT
end
