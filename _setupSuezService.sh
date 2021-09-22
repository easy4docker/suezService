#! /bin/sh
FULLDIR=$(pwd)
ROOTDIR=$(dirname $(dirname $(pwd)))

cd ${FULLDIR}

docker stop dishfu-suezService-container && docker rm dishfu-suezService-container  && docker image rm dishfu-suezService-image 
# --- && docker image prune -f
docker image build --file ${FULLDIR}/DockerfileSuezService -t dishfu-suezService-image .

MAIN_NET="33.33.33"
MAIN_IP="33.33.33.254"
docker network create \
    --driver=bridge \
    --subnet=${MAIN_NET}.0/16 \
    --ip-range=${MAIN_NET}.0/24 \
    --gateway=${MAIN_IP} \
    network_dishfu &> /dev/null

docker run -p 2000:2000 \
    --network network_dishfu --restart on-failure \
    --name dishfu-suezService-container -d dishfu-suezService-image