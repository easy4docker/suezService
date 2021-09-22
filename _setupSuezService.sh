#! /bin/sh
FULLDIR=$(pwd)
ROOTDIR=$(dirname $(dirname $(pwd)))

cd ${FULLDIR}

docker stop dishfu-suez-service-container && docker rm dishfu-suez-service-container  && docker image rm dishfu-suez-service-image 
# --- && docker image prune -f
docker image build --file ${FULLDIR}/DockerfileSuezService -t dishfu-suez-service-image .

MAIN_NET="33.33.33"
MAIN_IP="33.33.33.254"
docker network create \
    --driver=bridge \
    --subnet=${MAIN_NET}.0/16 \
    --ip-range=${MAIN_NET}.0/24 \
    --gateway=${MAIN_IP} \
    network_dishfu &> /dev/null

docker run -p 2000:3000 \
    --network network_dishfu --restart on-failure \
    --name dishfu-suez-service-container -d dishfu-suez-service-image