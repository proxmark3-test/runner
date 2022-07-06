#/bin/bash

mkdir -p /tmp/proxmark3
cd /tmp/proxmark3

tar xvf /tmp/pm3.tar > /dev/null

cd git

./pm3 -p /dev/ttyACM0 --reboot-to-bootloader
./client/proxmark3 -p /dev/ttyACM0 --flash --image ./armsrc/obj/fullimage.elf

sleep 20

./client/proxmark3 -p /dev/ttyACM0 -c "hf search"
