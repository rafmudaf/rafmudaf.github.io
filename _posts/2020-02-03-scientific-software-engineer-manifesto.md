---
title: 'Advancing the state of the art in scientific software'
date: 2018-03-11 00:00:00
excerpt: "or A Research Software Engineer's Manifesto"
---

This is an outline of my opinions on the current issues in scientific
software development and thoughts on how to improve them.

### Current problems

- Low level of experience among scientists writing software
- Low prioritization of software quality within research organizations
- NWTC works with a large amount of legacy code which is difficult to
  test and may require significant refactor to test

The results of these problems are
- Inefficiencies in further software development
    - Poor usage of version control hindering collaboration
    - Buggy code produced
    - Unsustainable architectures
    - Staff turnover can leave untested code in the hands of people who
      didnt write it which can lead to this code being rewritten or dropped entirely
- Research in practice may not match published results

### Proposed solutions

- Expanding and presenting a series of software development talks
- Changing the importance and understanding of the role of software
    - Software is the implementation of research. The idea is only as good as
      it is presented and it is typically presented in the form of software.
      The software is then used to create the slides or figures in a paper.
      **The implementation of research should match the quality of the research itself.**
- Rethinking the tools with which we work. Fortran and Python are not the only
  tools available and are often not the right tools for job. We should be more
  flexible in our tech stack and choose the tool that matches the application.
  Starting over with a different tool set should be an option.
    - A software may not be completely understood until well into
      development. Thus, the specific requirements and challenges are not
      obvious from the start. The software development industry has a practice
      of building a minimally viable product (MVP) quickly and then starting
      over after the proof of concept is complete.
- Verification and validation should accompany software
    - NREL's credibility and the quality of research can be negatively
      affected when we put untested and unvalidated software on GitHub
    - This should simply be a standard.
      **It "works" so put it on GitHub** should not be an option.
    - Define what it means to "work" and prove it!
