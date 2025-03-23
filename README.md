# openctf

Open-source alternative for [ctftime.org](https://ctftime.org)

## Checklist

- [ ] CTF Teams model:
  - Either created in openctf or imported with `unclaimed` status. Logged user might claim the team ownership which will be verified by the openctf administrator / moderator
  - sql view with top teams grouped by year based on their top 15 played ctfs particular year
- [ ] CTF events:
  - cron importing ctfs from ctftime keying on name - that way there won't be conflict if one adds the ctf here and there
  - weight of the CTF manually set based on experienced players opinion for first iteration of most popular ctfs, to be automatically corrected with weight formula
