# openctf

Open-source alternative for [ctftime.org](https://ctftime.org)

[![Deploy Backend](https://github.com/tomek7667/openctf/actions/workflows/deploy_backend.yml/badge.svg?branch=master)](https://github.com/tomek7667/openctf/actions/workflows/deploy_backend.yml)
[![Deploy Frontend](https://github.com/tomek7667/openctf/actions/workflows/deploy_frontend.yml/badge.svg)](https://github.com/tomek7667/openctf/actions/workflows/deploy_frontend.yml)
[![Update nginx](https://github.com/tomek7667/openctf/actions/workflows/nginx.yml/badge.svg)](https://github.com/tomek7667/openctf/actions/workflows/nginx.yml)

## Checklist

- [ ] CTF Teams model:
  - Either created in openctf or imported with `unclaimed` status. Logged user might claim the team ownership which will be verified by the openctf administrator / moderator
  - sql view with top teams grouped by year based on their top 15 played ctfs particular year
  - a clever way of merging two ctf teams
- [ ] CTF events:
  - cron importing ctfs from ctftime keying on name - that way there won't be conflict if one adds the ctf here and there
  - weight of the CTF manually set based on experienced players opinion for first iteration of most popular ctfs, to be automatically corrected with weight formula
- [ ] organizational
  - notification based contact with administrators of the platform -- a good form with topic, message and attachments
- [ ] mobile app in future
- [ ] bigger presence on social media from openctf; like autoamted posts about incoming (only verified!) events etc. some profiles on X, instagram;
