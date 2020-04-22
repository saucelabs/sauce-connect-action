#!/bin/bash

logFile="/Users/christianbromann/sauce-connect.log"
pidFile="/Users/christianbromann/sauce-connect.pid"
params="--logfile=$logFile --pidfile=$pidFile --verbose"

if test "${1}" ; then
    params+=" --user=${1}"
fi

if test "${2}"; then
    params+=" --api-key=${2}"
fi

if test "${3}"; then
    params+=" --cainfo=${3}"
fi

if test "${4}"; then
    params+=" --capath=${4}"
fi

if test "${5}"; then
    params+=" --config-file=${5}"
fi

if test "${6}"; then
    params+=" --direct-domains=${6}"
fi

if test "${7}"; then
    params+=" --dns=${7}"
fi

if test "${8}"; then
    params+=" --doctor"
fi

if test "${9}"; then
    params+=" --fast-fail-regexps=${9}"
fi

if test "${10}"; then
    params+=" --log-stats=${10}"
fi

if test "${11}"; then
    params+=" --max-logsize=${11}"
fi

if test "${12}"; then
    params+=" --max-missed-acks=${12}"
fi

if test "${13}"; then
    params+=" --metrics-address=${13}"
fi

if test "${14}"; then
    params+=" --no-autodetect"
fi

if test "${15}"; then
    params+=" --no-proxy-caching"
fi

if test "${16}"; then
    params+=" --no-remove-colliding-tunnels"
fi

if test "${17}"; then
    params+=" --no-ssl-bump-domains=${17}"
fi

if test "${18}"; then
    params+=" --pac=${18}"
fi

if test "${19}"; then
    params+=" --proxy=${19}"
fi

if test "${20}"; then
    params+=" --proxy-tunnel"
fi

if test "${21}"; then
    params+=" --proxy-userpwd=${21}"
fi

if test "${22}"; then
    params+=" --readyfile=${22}"
fi

if test "${23}"; then
    params+=" --rest-url=${23}"
fi

if test "${24}"; then
    params+=" --scproxy-port=${24}"
fi

if test "${25}"; then
    params+=" --scproxy-read-limit=${25}"
fi

if test "${26}"; then
    params+=" --scproxy-write-limit=${26}"
fi

if test "${27}"; then
    params+=" --se-port=${27}"
fi

if test "${28}"; then
    params+=" --shared-tunnel"
fi

if test "${29}"; then
    params+=" --tunnel-cainfo=${29}"
fi

if test "${30}"; then
    params+=" --tunnel-capath=${30}"
fi

if test "${31}"; then
    params+=" --tunnel-cert=${31}"
fi

if test "${32}"; then
    params+=" --tunnel-domains=${32}"
fi

if test "${33}"; then
    params+=" --tunnel-identifier=${33}"
fi

echo "sc $params"
/sc $params &
sleep 0.5

if [[ ! -f $logFile ]]
then
    echo "Sauce Connect could not create a log file"
    exit 1
fi

while ! grep "Sauce Connect is up, you may start your tests." $logFile ; do
    if [[ ! -f $pidFile ]]
    then
        echo "Sauce Connect shutdown unexpected"
        exit 1
    fi

    echo "Sauce Connect is booting..."
    sleep 1
done

echo "Started Sauce Connect"
