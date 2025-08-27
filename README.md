# openctf

Open-source alternative for [ctftime.org](https://ctftime.org)

[![Backend](https://github.com/tomek7667/openctf/actions/workflows/deploy_backend.yml/badge.svg?branch=master)](https://github.com/tomek7667/openctf/actions/workflows/deploy_backend.yml)
[![Frontend](https://github.com/tomek7667/openctf/actions/workflows/deploy_frontend.yml/badge.svg)](https://github.com/tomek7667/openctf/actions/workflows/deploy_frontend.yml)
[![Nginx](https://github.com/tomek7667/openctf/actions/workflows/nginx.yml/badge.svg)](https://github.com/tomek7667/openctf/actions/workflows/nginx.yml)

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

## Known bugs / needed refactor

- [ ] many places except the frontend, display difficulty metric named "weight" where in reality:
  - **weight**: assigned points from the weight pool, based on the difficulty and quality metrics
  - **difficulty**: top 15 teams choices how hard the CTF really was
  - **quality**: top 50 teams choices what was the overall quality of communications, infra etc.
- [ ] many places in the code the "ratingOpinion" is used as a name for ratingQuality. It should be rating quality as that's the metrics name, not opinion.
