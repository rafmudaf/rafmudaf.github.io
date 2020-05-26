---
title: 'Advancing the state of the art in scientific software'
date: 2020-02-03 00:00:00
excerpt: "or A Research Software Engineer's Manifesto"
---

This is an outline of my opinions on the current issues in scientific
software development and thoughts on how to improve them.

### Current problems

- Low level of software engineering experience among scientists writing software
- Low prioritization of software quality within research organizations
- Research organizations tend to rely on legacy code which is difficult to
  test and/or may require significant refactor to test

The results of these problems are
- Inefficiencies in further software development
    - Poor usage of version control hindering collaboration
    - Possibility for buggy code to be used and released
    - Unsustainable architectures
    - Staff turnover can leave untested code in the hands of people who
      didnt write it which can lead to this code being rewritten or dropped entirely
- Research in practice may not match published results
- Behavior of software is often not fully characterised

### Proposed solutions

- Formal training in software development and software engineering within
  scientific research institutions
  - University of Virginia has a couple of courses under the umbrella of
    "Software as a Research Tool"
  - I've developed and given a few talks on basic software engineering concepts
- Change the value and understanding of the role of software
    - Software is the implementation of research. The idea is only as good as
      it is presented and it is typically presented in the form of software.
      The software is then used to create the slides or figures in a paper.
      **The implementation of research should match the quality of the research itself.**
- Rethink the tools with which we work. Fortran and Python are not the only
  tools available and are often not the right tools for job. We should be more
  flexible in our tech stack and choose the tool that matches the application.
  Starting over with a different tool set should be an option.
    - A software may not be completely understood until well into
      development. Thus, the specific requirements and challenges are not
      obvious from the start. The software development industry has a practice
      of building a minimally viable product (MVP) quickly and then starting
      over after the proof of concept is complete.
- Verification and validation should accompany software
    - A research institution's (NREL, in my case) credibility and the quality
      of research can be negatively affected when untested and unvalidated
      software is made publicly available on GitHub
    - V&V should simply be a standard.
      **It "works" so put it on GitHub** should not be an option.
    - Define what it means to "work" and prove it!

### Why these things matter

All too often, research software is developed in order to produce results for
a particular paper or presentation. Afterwards, the software component of
the research is left alone until the next paper or presentation requires
some more development. This stepwise development cycle tends to leave
intentional design out of the development process resulting in a toolset
lacking a framework for consistent and scalable development.

This impacts more than just the software development workflow. I'm currently
working on a project where the team's collective lack of agility and
adherance to best practices regarding version control has left the software
with a major feature "working, but not understood" and very tightly coupled
to the release of other working and well understood features. Essentially,
there may be a bug or otherwise incorrectly incorporated model into our software.
However, since a lot of work was simultaneously incorporated into one
development branch with poor commit tracking, the questionable model cannot be
easily reverted. So, now the team is stuck releasing a version of a
simulation and modeling software that may have a problematic model, but the
alternative is to not deliver on our mandated milestone.

In an interesting irony, I'm also involved in a project on the flip side of
this scenario where the existing tests are very sensitive and each change
can take a long time to properly explain and validate. Though there is
quite a bit of certainty with each change, the flexibility within the
project is stiff.

Both of these scenarios are rooted in the same issue. And both could be
avoided by including a proper testing infrastucture and following best
practices for building the software with regard to scalability and
maintainability. The method for doing so isn't necessarily intuitive,
so it is critical so teach researchers how to do these things.
