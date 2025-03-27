# Rating & Points

## ctftime problems

- points inflation: too many competitions have 100.0 weight
- imcomparable weights: an easy competition can be voted very highly as the quality might be high, similarly to a hard competition; discouraging hard competitions
- there's always a huge gap between 1st and 2nd place in highly ranked competitions

## propositions

### points pooling

fixed weight points pool from which weights are _somehow_ given to particular events, especially to those known for their quality and level.

first edition of the ctf will always have 0 weight points assigned, if it reaches >= 50 teams next year it will be taken into consideration for weight points assignment. If not try next time. This is to prevent from hacking the rating.

- solves inflation problem as the pool is fixed, and even though there can be more ctfs, the distribution might become more distilled, but the inflation is stopped
- given N being all points granted by the 1 competition to teams and M being all points granted by the 2nd competition to teams, if they have the same weight W, then N == M

### completely different ranking

ranking taken from some esports game like LoL / pubg / some battle royales: if a tournament (in some game) is one year of competitions (ctf competitions) and one match (in the tournament) is one competition (ctf competition) it can be easily reused for ctf ranking.
