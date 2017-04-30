#!/usr/bin/env python3

import argparse
import signal
import subprocess
import sys
import threading


default_command = '''
    ./node_modules/next/dist/bin/next-start
        --hostname 0.0.0.0
        --port 8000
'''.split()


stop_event = threading.Event()
signals_received = []


def handle_signal(signum, frame):
    signals_received.append(signum)
    stop_event.set()


def main():
    p = argparse.ArgumentParser()
    p.add_argument('command', nargs=argparse.REMAINDER)
    args = p.parse_args()
    command = args.command or default_command
    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)
    p = subprocess.Popen(command)
    try:
        while True:
            if p.poll() is not None:
                sys.exit(p.returncode)
            stop_event.wait(1)
            if stop_event.is_set():
                print('Stopping - received signal', signals_received, flush=True)
                break
    finally:
        p.terminate()
        sys.exit(p.wait())
    print('Done.')


if __name__ == '__main__':
    main()
