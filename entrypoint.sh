#!/bin/bash

logFile="/srv/sauce-connect.log"
pidFile="/srv/sauce-connect.pid"
params="--logfile=$logFile --pidfile=$pidFile --verbose"

if test "${1}" ; then
    params="${params} --user=${1}"
fi

if test "${2}"; then
    params="${params} --api-key=${2}"
fi

if test "${3}"; then
    params="${params} --cainfo=${3}"
fi

if test "${4}"; then
    params="${params} --capath=${4}"
fi

if test "${5}"; then
    params="${params} --config-file=${5}"
fi

if test "${6}"; then
    params="${params} --direct-domains=${6}"
fi

if test "${7}"; then
    params="${params} --dns=${7}"
fi

if test "${8}"; then
    params="${params} --doctor"
fi

if test "${9}"; then
    params="${params} --fast-fail-regexps=${9}"
fi

if test "${10}"; then
    params="${params} --log-stats=${10}"
fi

if test "${11}"; then
    params="${params} --max-logsize=${11}"
fi

if test "${12}"; then
    params="${params} --max-missed-acks=${12}"
fi

if test "${13}"; then
    params="${params} --metrics-address=${13}"
fi

if test "${14}"; then
    params="${params} --no-autodetect"
fi

if test "${15}"; then
    params="${params} --no-proxy-caching"
fi

if test "${16}"; then
    params="${params} --no-remove-colliding-tunnels"
fi

if test "${17}"; then
    params="${params} --no-ssl-bump-domains=${17}"
fi

if test "${18}"; then
    params="${params} --pac=${18}"
fi

if test "${19}"; then
    params="${params} --proxy=${19}"
fi

if test "${20}"; then
    params="${params} --proxy-tunnel"
fi

if test "${21}"; then
    params="${params} --proxy-userpwd=${21}"
fi

if test "${22}"; then
    params="${params} --readyfile=${22}"
fi

if test "${23}"; then
    params="${params} --rest-url=${23}"
fi

if test "${24}"; then
    params="${params} --scproxy-port=${24}"
fi

if test "${25}"; then
    params="${params} --scproxy-read-limit=${25}"
fi

if test "${26}"; then
    params="${params} --scproxy-write-limit=${26}"
fi

if test "${27}"; then
    params="${params} --se-port=${27}"
fi

if test "${28}"; then
    params="${params} --shared-tunnel"
fi

if test "${29}"; then
    params="${params} --tunnel-cainfo=${29}"
fi

if test "${30}"; then
    params="${params} --tunnel-capath=${30}"
fi

if test "${31}"; then
    params="${params} --tunnel-cert=${31}"
fi

if test "${32}"; then
    params="${params} --tunnel-domains=${32}"
fi

if test "${33}"; then
    params="${params} --tunnel-identifier=${33}"
fi

docker pull saucelabs/sauce-connect:4.6.2
docker run \
    -v /tmp:/tmp \
    --network="host" \
    -t saucelabs/sauce-connect:4.6.2 \
    $params &

until [ -f /tmp/sc.ready ]
do
    sleep 5
done
echo "SC ready"
