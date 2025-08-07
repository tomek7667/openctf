dotenv = open(".env.prod", "r+").read()
envs = [a.strip() for a in dotenv.split("\n") if a != "" and not a.startswith("#")]


envstring = ""
for env in envs:
    key = env.split("=")[0]
    envstring = f"{envstring} {key}=\"${{{{ secrets.{key} }}}}\""
print(envstring)