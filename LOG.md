## OS Setup

### Server
* Installed Raspberry Pi OS (64-bit) onto an SD card using the Raspberry Pi Imager
* Installed Ubuntu 24.04.2 LTS onto a SanDisk 128 GB Extreme PRO USB 3.2 Solid State Flash Drive
    * Was having issues with high CPU usage due to IOWAIT running the server off of the SD card
* Used this usb-boot script to configure the host to perform boot off of the USB drive (with the SD card still installed)
    * https://forums.raspberrypi.com/viewtopic.php?f=29&t=196778
* After updating the OS, unfucked my iptables: https://forums.raspberrypi.com/viewtopic.php?t=282120

### Agent
* Installed Raspberry Pi OS (64-bit) onto an SD card using the Raspberry Pi Imager

### Shared

#### Packages
```bash
# Install docker
$ sudo apt install -y docker.io

# Check for OS container features enabled
$ sudo docker info

# You should see something like this
#
# WARNING: No memory limit support
# WARNING: No swap limit support
# WARNING: No kernel memory limit support
# WARNING: No kernel memory TCP limit support
# WARNING: No oom kill disable support

# Enable the required container features
$ sudo sed -i \
'$ s/$/ cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1 swapaccount=1/' \
/boot/firmware/cmdline.txt

# We need to reboot for the kernel flags to take effect.
$ sudo reboot
```

#### Networking
On each host, modified the `/etc/netplan/50-cloud-init.yaml` file to contain the following contents:

```bash
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: yes
```

Plugged the pi into the switch, then logged into the admin interface on the switch and created a DHCP reservation for the specified MAC address.

## K3 Setup
Copied SSH keys from my mac to the raspberry pi:
```
ssh-copy-id amckittrick@amckittrick-rpiX
```

Authorized sudo to be used without repeating my password:
```
# sudo visudo

# Then add to the bottom of the file
amckittrick ALL=(ALL) NOPASSWD: ALL
```

Disabled the firewall:
```bash
sudo ufw disable
sudo iptables -F
```

Install on the server:
```bash
k3sup install --ip 10.42.42.10 --user amckittrick
```

Export the KUBECONFIG and check status:
```bash
export KUBECONFIG=/Users/andrewmckittrick/Code/goal-tracker/kubeconfig
kubectl get node -o wide
```

Temporarily disable swap:

```bash
sudo swapoff -a
```

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.9/config/manifests/metallb-native.yaml