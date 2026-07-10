import subprocess, sys
r = subprocess.run([sys.executable, "scripts/maxwell_autodream.py"], cwd="/opt/ivoire-monade", capture_output=True, text=True)
print("STDOUT:", r.stdout)
print("STDERR:", r.stderr)
print("RC:", r.returncode)
sys.exit(r.returncode)
