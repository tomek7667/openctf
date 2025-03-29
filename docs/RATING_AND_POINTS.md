# Rating & Points

## ctftime problems

- points inflation: too many competitions have 100.0 weight
- imcomparable weights: an easy competition can be voted very highly as the quality might be high, similarly to a hard competition; discouraging hard competitions
- there's always a huge gap between 1st and 2nd place in highly ranked competitions
- voting manipulation: people rate CTF really from 0 to 100, but see only clamped values. Should be more like: "what do you think this ctf should be worth from 0 to 100" and then clamp it
- points for a challenge might influence global ranking points

## openctf solution

fixed weight points pool from which weights are _somehow_ given to particular events, especially to those known for their quality and level.

first edition of the ctf will always have 0 weight points assigned, if it reaches >= 50 teams next year it will be taken into consideration for weight points assignment. If not try next time. This is to prevent from hacking the rating.

- solves inflation problem as the pool is fixed, and even though there can be more ctfs, the distribution might become more distilled, but the inflation is stopped
- given N being all points granted by the 1 competition to teams and M being all points granted by the 2nd competition to teams, if they have the same weight W, then N == M

This should be combined with one more rating mechanism. the discussed above weight points are pure ranking for the difficulty of a competition. Besides that, after each competition top 50 players or top 30% _(whichever is smaller)_ can vote from 0 stars to 5 stars on how did they like the CTF, this is purely opinionated rating. The combination of stars _(opinion)_ and weight points _(ctf difficulty)_ will provide the following types:

- high amount of weight points + 5 stars rating = great and hard ctf
- high amount of weight points + 1 star rating = probably guessy, poorly organized hard ctf
- low amount of weight points + 5 stars rating = great competition for beginners, if you'd like to learn, but won't get you many points as it's mostly easy. Step out of your comfort zone and try harder competitions to get higher amount of points.
- low amount of weight points + 1 stars rating = bad and not really established CTF. Much work to do on that one.
