#!/bin/bash

params=""

if test "$1" ; then
    params+=" --user=$1"
fi

if test "$2"; then
    params+=" --api-key=$2"
fi

if test "$3"; then
    params+=" --cainfo=$3"
fi

if test "$4"; then
    params+=" --capath=$4"
fi

if test "$5"; then
    params+=" --config-file=$5"
fi

if test "$6"; then
    params+=" --direct-domains=$6"
fi

if test "$7"; then
    params+=" --dns=$7"
fi

if test "$8"; then
    params+=" --doctor"
fi

if test "$9"; then
    params+=" --fast-fail-regexps=$9"
fi

if test "$10"; then
    params+=" --log-stats=$10"
fi

if test "$11"; then
    params+=" --logfile=$11"
fi

if test "$12"; then
    params+=" --max-logsize=$12"
fi

if test "$13"; then
    params+=" --max-missed-acks=$13"
fi

if test "$14"; then
    params+=" --metrics-address=$14"
fi

if test "$15"; then
    params+=" --no-autodetect"
fi

if test "$16"; then
    params+=" --no-proxy-caching"
fi

if test "$17"; then
    params+=" --no-remove-colliding-tunnels"
fi

if test "$18"; then
    params+=" --no-ssl-bump-domains=$18"
fi

if test "$19"; then
    params+=" --pac=$19"
fi

if test "$20"; then
    params+=" --pidfile=$20"
fi

if test "$21"; then
    params+=" --proxy=$21"
fi

if test "$22"; then
    params+=" --proxy-tunnel"
fi

if test "$23"; then
    params+=" --proxy-userpwd=$23"
fi

if test "$24"; then
    params+=" --readyfile=$24"
fi

if test "$25"; then
    params+=" --rest-url=$25"
fi

if test "$26"; then
    params+=" --scproxy-port=$26"
fi

if test "$27"; then
    params+=" --scproxy-read-limit=$27"
fi

if test "$28"; then
    params+=" --scproxy-write-limit=$28"
fi

if test "$29"; then
    params+=" --se-port=$29"
fi

if test "$30"; then
    params+=" --shared-tunnel"
fi

if test "$30"; then
    params+=" --shared-tunnel"
fi

if test "$31"; then
    params+=" --tunnel-cainfo=$31"
fi

if test "$32"; then
    params+=" --tunnel-capath=$32"
fi

if test "$33"; then
    params+=" --tunnel-cert=$33"
fi

if test "$34"; then
    params+=" --tunnel-domains=$34"
fi

if test "$35"; then
    params+=" --tunnel-identifier=$35"
fi

if test "$36"; then
    params+=" --verbose"
fi

sc $params &
while ! grep "Sauce Connect is up, you may start your tests." foo.txt ; do
    echo "Sauce Connect is booting..."
    sleep 1
done
