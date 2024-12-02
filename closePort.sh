while getopts "p:" opt; do
  case $opt in
    p) port=$OPTARG ;;
    \?) echo "Usage: $0 -p <portnumber>" >&2
        exit 1 ;;
  esac
done

if [ -z "$port" ]; then
  echo "Please specify a port using the -p flag."
  exit 1
fi

pid=$(lsof -t -i:$port)

if [ -z "$pid" ]; then
  echo "No process found using port $port."
else
  echo "Stopping process with PID: $pid"
  kill $pid
fi
# v2.0.0