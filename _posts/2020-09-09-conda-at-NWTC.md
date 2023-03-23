---
title: 'Notes from Working with conda'
date: 2020-09-09 00:00:00
excerpt: Notes from a conda demo I gave at NREL.
featured_image: /images/ge_shadow.jpg
---

Update 6/2/2021: I compiled all these notes for our usage at NWTC, but there's a lot of good
information on the internet. Here's
[another source](https://whiteboxml.com/blog/the-definitive-guide-to-python-virtual-environments-with-conda)
that is more comprehensive and worth reading or referring back to in the future.

## conda as a Development Tool

and specifically how to use it in the common workflows at NWTC.

**Anaconda Inc** (previsouly Continuum Analytics) - Anaconda is a software development and
    consulting company of passionate open source advocates based in Austin, Texas, USA. We are
    committed to the open source community. We created the **Anaconda Python distribution** and
    contribute to many other open source-based data analytics tools.

**Anaconda** \- A distribution of Python and R tools for scientific computing
    (primarily data science).

**Miniconda** \- A slim version of Anaconda containing only Python, conda, and their dependencies.

**conda** \- A language-agnostic package manager and environment management system.

Nice [SO answer](https://stackoverflow.com/a/58112484/3288632) explaining this.

## Why use conda

- Virtual environments
- Package manager
- Flexible
- Portable

It's also a build system (`conda-build`) that enables packaging and distributing software to
multiple platforms.

### Virtual environments and why use them

Sandboxed configuration so that installations do not affect other environments.

- Python comes with [venv](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/).
- I previously used [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/).

Prevents depedencies from conflicting so that your development environment has low risk of becoming
corrupted.

Common use case: You're developing FLORIS (or WISDEM or anything else), but also working on a
paper using the latest release. Instead of using a single Python/PIP and adding
`sys.path.append()` to your scripts to point to the appropriate repository, you should create
a virtual environment for each project: `floris_dev` and `floris`.

## Setup

Anaconda vs Miniconda

- Miniconda is Python, conda, and their dependencies
- Given Miniconda, you can install all of the packages included in Anaconda  
    Just use Miniconda :)

I like to install Miniconda into my user directory (`/Users/rmudafor` instead of `/opt`).

### Channels

`conda` can gather packages from various locations on the internet. The default is Anaconda's
own [package repository](https://anaconda.org/anaconda/repo), but these packages are generally
limited to build tools and low level libraries used to build software.

`conda-forge` is another much more general purpose channel. It is community supported and
therefore contains higher level, end user tools. **We generally use conda + conda-forge**.

Add conda-forge as a default channel: `conda config --append channels conda-forge`.

Any user on Anaconda has a channel. For example, FLORIS could be installed from my account on
Anaconda Cloud but its out of date:

```bash
(dev1) >>mbp@~ $ conda search floris -c rafmudaf
Loading channels: done
# Name                       Version           Build  Channel             
floris                         1.1.5          py37_0  rafmudaf            
floris                         1.1.6  py37h39e3cac_0  rafmudaf            
floris                         1.1.7  py36h9f0ad1d_0  conda-forge         
floris                         1.1.7  py37hc8dfbb8_0  conda-forge         
floris                         1.1.7  py38h32f6830_0  conda-forge         
floris                         2.1.0  py36h9f0ad1d_0  conda-forge         
floris                         2.1.0  py37hc8dfbb8_0  conda-forge         
floris                         2.1.0  py38h32f6830_0  conda-forge         
floris                         2.1.1  py36h9f0ad1d_0  conda-forge         
floris                         2.1.1  py37hc8dfbb8_0  conda-forge         
floris                         2.1.1  py38h32f6830_0  conda-forge 
```

## Usage demo

[conda cheat sheet](https://docs.conda.io/projects/conda/en/4.6.0/_downloads/52a95608c49671267e40c689e0bc00ca/conda-cheatsheet.pdf)  
[conda general commands docs](https://docs.conda.io/projects/conda/en/latest/commands.html#conda-general-commands)

```bash
# Create an environment
conda create -n dev1							# Create the virtual environment with no packages
conda create -n dev1 python=3.7					# Create the environment and install Python
conda create -n dev1 python=3.7 numpy=1.16.1	# Create the environment and install Python and Numpy
conda create --prefix ~/Development/conda-env   # Create an environment in a user-specified location; this can be used to create a virtual environment in a shared location for multiple people to use

# Activate
conda activate dev1

# Add conda-forge to the default channels list
conda config --env --append channels conda-forge
# with --env, adds to /opt/miniconda3/envs/dev1/.condarc
# otherwise, adds to /Users/rmudafor/.condarc
```

What happens when you switch environments?

```bash
# Show the current $PATH variable
conda activate dev1
printpath

# Switch to another env
conda activate floris
printpath
```

Installing Python packages: conda or pip

- The problem is that they dont know about each other

```bash
conda install numpy
ls /opt/miniconda3/envs/dev1/lib/python3.7/site-packages/
conda uninstall numpy

pip install numpy
ls /opt/miniconda3/envs/dev1/lib/python3.7/site-packages/
pip uninstall numpy
```

**The one that was installed most recently is used by Python.**

General rule: pick one and stick with it. The internet recommends using `conda` since the system
to manage and satisfy dependencies is more robust. I've been using `pip` almost exclusively and it
has worked well.

### Development install

```bash
# Using pip
pip install -e <path to project>

# Not using pip
python setup.py develop
## The packages installed here are known to both conda and pip
```

### Exporting an environment definition

This is similar to `requirements.txt` used with pip.

```bash
# Export an environment
conda env export --file environment.yml

# Load an environment from a file
conda env create -n dev2 -f /path/to/environment.yml
```

## Conda-build

Distributing software with conda-build requires building a "recipe" that is used to automatically
build the software on the target platforms. It can be challenging to get this right, so get in
touch if you're interested in this.

TODO: add notes here.
