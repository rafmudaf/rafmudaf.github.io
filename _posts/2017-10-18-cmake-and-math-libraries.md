---
title: 'Compiling with CMake and Intel MKL'
date: 2017-10-18 00:00:00
featured_image:
excerpt: How to get CMake to find a math library
---

# CMake and MKL

These don't always play well.

## Background

This post is mostly for my own future reference. The problem I had for about
a full month was in linking MKL to my project’s build through CMake. The
project I’m working on, [OpenFAST](https://github.com/openfast/openfast),
requires BLAS and LAPACK math libraries. Generally, Intel’s MKL libraries
are better performing than the open source versions like OpenBLAS.
However, working on a shared compute cluster means that I don’t have
direct access to installing packages. The cluster I use has a package
manager called `module` which modifies your `$PATH` to load and unload
packages.

## Problem

The CMake configuration in OpenFAST includes

```
find_package(BLAS required)
find_package(LAPACK required)
```

which should find the appropriate BLAS and LAPACK libraries, including
MKL when it is loaded. For some odd reason this doesn’t work. However,
inspecting the module which loads `ifort` shows that the environment
variable `$BLASLIB` is set.

## Solution

Thus, the math libraries can be passed explicitly to CMake with this command:

```bash
cmake .. -DBLAS_LIBRARIES=$BLASLIB -DLAPACK_LIBRARIES=$BLASLIB
```
