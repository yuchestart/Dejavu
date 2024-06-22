# LEGEND

[ ] - Incomplete
[/] - In progress
[X] - Complete


# Screaming Chaser(screamingchaser)
COMPLETION:
[/] Mechanics
[X] Visuals
[X] Audio
Type: Billboard
Image: assets/img/screamingchaser.png
Asset Name: screamingchaser
Description:

The screaming chaser spawns in randomly throughout the level, at least 2 segments away from the player. The screaming chaser spawns at the center of the segment.
The screaming chaser plays "unsettlingscream.mp3"(loud screams of various pitches), which gets louder the player is closer to it.
Initially, the screaming chaser DFS's a path to the player, changing the path every time the player changes segments. Upon entering the player's segment, the screaming chaser will follow the player by getting the difference of vectors.
When the player is 0.75 units away from the screaming chaser, the player dies and gets jumpscared.
The screaming chaser despawns after an accumulated of 2 minutes time in following the DFS path, as long as it's outside of the hearing threshold of the player.

# Neck Snapper(necksnapper)
COMPLETION:
[ ] Mechanics
[X] Visuals
[ ] Audio

Type: Billboard
Image: assets/img/necksnapper.png
Asset Name: necksnapper
Jumpscare Audio: High pitched noise followed by the sound of a neck snapping.
Jumpscare Visual: The face of the monster, the hands approach the camera's "neck", and then cut to black.
Description:

The neck snapper spawns randomly throughout the level, at least 1 segment away from the player.
It follows the player, through DFS until it is in the same segment as the player.

The neck snapper becomes active after 1 minute of following the player and when it's in the same segment as the player.
Upon being activated, the neck snapper will follow the player for a range of 5 seconds - 1 minute.
During the range of time, it will give out an auditory warning, "breathing.mp3"(heavy breathing), positioned at the neck snapper.
If the player looks at the neck snapper, it will freeze in place for 3-5 seconds before running at the player, a speed of 2 units per second.
In this case, if the player comes within 0.5 units away from the neck snapper, the player dies and gets jumpscared.
In the case where the player does not look at the neck snapper, another sound plays: "peekaboo.mp3"(childish voice saying "Peek a' boo!"), and the player dies and gets jumpscared.

The neck snapper despawns after an accumulated of 1 minutes time in following the DFS path.

# Shall not pass/Border Guard(shallnotpass)
COMPLETION:
[ ] Mechanics
[ ] Visuals
[ ] Audio
Type: Mesh
Mesh: assets/mesh/shallnotpass.json
Asset Name: shallnotpass
Visual Description: A security guard of unknown affiliation, armed with a rifle, dressed in tactical gear similar to a US soldier but colors are mainly blueish-grey, has missing eyes that are bleeding, and sharp, pointed teeth, male face, caucasian.
Jumpscare Audio: 3 gunshots, separated exactly 0.1 seconds after eachother. After the first gunshot, a high pitched ringing noise.
Jumpscare Visual: The guard shoots you and stares at you, his eyes glowing with red light. After every gunshot, the camera shakes. After about 3 seconds, the camera falls flat to the floor.
Description:

On occasional points throughout the level, the shall not pass spawns on the entrance of a segment.
If the player enters an unobstructed distance of 10 units, then a sound plays positioned at the guard: "donotpass.mp3"(A guard hoarsely barking: "Do not pass.");
If the player enters an unobstructed distance of 3 units, then the jumpscare is triggered before the player dies.
Shall not pass despawns after 3 minutes of inactivity.

# Stair Chaser/Get outta my property(stairchaser)
COMPLETION:
[ ] Mechanics
[ ] Visuals
[ ] Audio
Type: Billboard
Image: assets/img/stairchaser.png
Asset Name: stairchaser
Visual Description: A pair of bloodshot eyes, the irises are red. It's full body cannot be seen because it's in a cloud of black.
Jumpscare Audio: An angry, hoarse, Alabama'y voice saying "And stay out!" with a zapping sound playing for the duration of the jumpscare.
Jumpscare Visuals: The pair of bloodshot eyes looks at you, even more bloodshot, the irises and the eyes themselves glowing red. with an electric effect crossing the entire screen.
Description:

The stair chaser spawns after the player spends an accumulated 90 seconds in the stairwell. If the player is closer to the bottom, the stair chaser spawns up one flight of stairs, otherwise the stair chaser spawns down one flight of stairs.

The stair chaser will play "getoffamyproperty.mp3"(an angry, hoarse, Alabama'y voice shouting "get outta my property!") immediately after spawning, and start chasing the player up or down the stairs. The stair chaser will get progressively faster, until it is at 1.5 of the player's running speed.
Upon the player being 0.5 units away from the stair chaser, the player gets jumpscared and dies.
If the player exits the stairwell, then "andstayout.mp3" will play andstayout.mp3(A angry, hoarse, Alabama'y voice shouting "and stay out!"), and then despawns.

# Shadowy Piano Man(shadowypianoman)
COMPLETION:
[ ] Mechanics
[ ] Visuals
[ ] Audio
Type: Mesh
Mesh: assets/mesh/shadowypianoman.json
Asset Name: shadowypianoman
Visual Description: A man playing the piano, both completely black.
Jumpscare Audio: creepymusic.mp3 but the equalizer is turned way up
Jumpscare Visuals: The shadowy piano man punches the camera, and blackout.
Description:

Shadowy piano man spawns randomly throughout the level, at least 5 segments away from the player, outside visual range.
You can hear creepymusic.mp3 playing on loop when you are within the vicinity of the shadowy piano man.
If the shadowy piano man is in visual range of the player, and the player can see him, then creepymusic.mp3 stops and he disappears after 0.2 seconds.
After that, the jumpscare is triggered.