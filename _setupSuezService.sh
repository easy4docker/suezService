#! /bin/sh
FULLDIR=$(pwd)
ROOTDIR=$(dirname $(dirname $(pwd)))

cd ${FULLDIR}

echo ${FULLDIR}=====
docker stop suez-service-container && docker rm suez-service-container  && docker image rm suez-service-image 
# --- && docker image prune -f
docker image build --file ${FULLDIR}/DockerfileSuezService -t suez-service-image  .

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
    --name suez-service-container -d suez-service-image