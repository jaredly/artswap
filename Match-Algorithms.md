
Some different options for match algorithms:

- greedy first match (tie goes to ranking)
- random match (generate full list of potential matches, randomly grab one; remove all now-invalid matches; repeat)
- best rank (tie goes to first vote)
- max matches

- edmonds-blossom-fixed will do it perfectly it kinda looks like? hmmmm

A1
A2
B
C1
C2
C3

A likes B and C1 and C2
B likes A2
C likes A1

A1 - C1
A1 - C2
B - A2

So, for weighting ... I do want (more matches) more than I want (most preferred matches).
So each pair would have weight of like 5, but + or - up to 1 to indicate relative preference.

anddddd I think I'll give early matches a little bit of an edge. right?

I do like me some early/greedy, because that gives information to latecomers about what is possible.

ooooooooooooh ok, so what if it's multiple rounds?
-> first round of tinder-style voting, anddd maybe you have to do like a set number of selections (let's say 5)
-> we use blossom to get the max number of matches out, and they're removed from the running
-> the remaining artists vote in the second round, having another chance to express preference
-> final round is random? or something
