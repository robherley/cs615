for host in `cat hosts.txt`; do
  echo "starting traceroute for $host"
  traceroute -m 30 -a $host 2>/dev/null > trace-$host.txt &
done

# cat trace-* | grep -E -o '\[AS[0-9]+\]' | sort | uniq -c