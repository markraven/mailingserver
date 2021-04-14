Vagrant.configure("2") do |config|
    config.vm.box = "bento/ubuntu-18.04"
    config.vm.network :public_network, ip: "1.2.3.4"
    config.vm.provision "shell", inline: <<-SCRIPT
        apt-get update
        apt-get install -y nodejs
    SCRIPT
end
