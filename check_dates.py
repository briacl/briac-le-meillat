import json
import os
import subprocess

with open("briac-le-meillat/public/data/registry.json", "r") as f:
    reg = json.load(f)

for item in reg.get("proofs", []):
    if not item.get("date"):
        path = "briac-le-meillat/public/" + item["path"]
        try:
            date_cmd = "git log --diff-filter=A --format=%cd -1 --date=short -- " + path
            res = subprocess.check_output(date_cmd, shell=True).decode("utf-8").strip()
            if not res:
                date_cmd = "git log -1 --format=%cd --date=short -- " + path
                res = subprocess.check_output(date_cmd, shell=True).decode("utf-8").strip()
            path_str = item["path"]
            print(path_str + " -> git date: " + res)
        except:
            print("Error checking " + path)
