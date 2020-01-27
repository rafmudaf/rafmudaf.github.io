---
title: 'Game of Life'
subtitle: 'A ProcessingJS implementation'
date: 2016-09-16 00:00:00
featured_image: '/images/projects/game_of_life/infinity.png'
---

![](/images/projects/game_of_life/demo.gif)

View the site [here](http://www.rafmudaf.com/projects/LifeJS/index.html).

Way back when I started this obsession with software development,
I built a website simulating Conway's Game of Life. In
trying to focus on the delivery rather than the implementation, I chose
ProcessingJS as a framework since it provided simple control of the UI
and is written in JavaScript so integrating my own simulation engine would
be straightforward. I created a custom grid so that it could be manipulated
on the fly when live cells pass through.

There isn't much game play in this simulation. The purpose is mostly
to demonstrate cellular automata, but we get some pretty
pictures. To "play", create a seed by clicking on cells making them
"alive" or "dead". The cells on the edge are held constant, and they
do impact the cells on the interior. An interesting starting point
is one where a few neighboring edge cells are alive with some nearby
interior live points.

The rules for determining which cells live or die in the next generation are:

1. Any live cell with fewer than two live neighbours dies, as if caused by
   under-population
2. Any live cell with more than three live neighbours dies, as if by
   over-population
3. Any live cell with two or three live neighbours lives on to the next
   generation
4. Any dead cell with exactly three live neighbours becomes a live cell, as
   if by reproduction

You can iterate through individual generations or go on to infinity
using the control buttons. The sketch stops running when the generations stop
changing so that your computer doesn't do wasted work. You can change
the status of cells at any time.

Adjust the grid size as you please! The three options for grid resolution
are:

- Coarse: 10 x 10
- Medium: 25 x 25
- Fine: 50 x 50
