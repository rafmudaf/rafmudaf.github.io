---
title: 'Notes on writing good code in Fortran'
date: 2021-03-03 00:00:00
excerpt: "Mostly for my own future reference so its not pretty."
featured_image: /images/ge_shadow.jpg
---

## High-performance programming in Fortran
Being a compiled language designed for scientific and engineering
applications, Fortran is well suited for producing very efficient
code. However, the process of tuning code requires developers to
understand the language as well as the tools available (compilers,
performance libraries, etc) in order to generate the highest
performance. This section identifies programming patterns to use
Fortran and the Intel® Fortran compiler most effectively.

## Optimization report
Fortran compilers have multiple levels of optimization available
from no optimization to extreme optimization tuned to a particular
machine architecture and operating system combination. Timing tests
alone are not a good indication for the compiler's ability to optimize
a particular portion of code. Therefore, developers should generate
optimization reports to get line-by-line reporting on optimizations
such as vectorization, parallelization, memory and cache usage,
threading, and others.

https://software.intel.com/content/www/us/en/develop/articles/vectorization-and-optimization-reports.html

- Link to flags for optimization report settings
- Detail the process for generating the optrpt

## Operator Strength Reduction
Each mathematical operation has an effective "strength", and some
operations can be equivalently represented as a combination of multiple
reduced-strength operations that have better performance than the
original. As part of the code optimization step, compilers may be
able to identify areas where a mathetical operation's strength can
be reduced. Compilers are not able to optimize all expensive operations. For
example, cases where a portion of an expensive mathematical operation
is a variable contained in a derived data type are frequently skipped.
Therefore, it is recommended that expensive subroutines be profiled
and searched for possible strength reduction opportunities.

A concrete example of operator strength reduction is in dividing
many elements of an array by a constant.

```fortran

  module_type%scale_factor = 10.0

  do i = 1
    if array(i) < 30.0
      array(i) = array(i) / module_type%scale_factor
    end if
  end do
```

In this case, a multiplication of real numbers is less expensive
than a division of real numbers. The code can be factored so that
the inverse of the scale factor is computed outside of the loop
and the mathematical operation in the loop is converted to a
multiplication.

```fortran

  module_type%scale_factor = 10.0
  inverse_scale_factor = 1.0 / module_type%scale_factor

  do i = 1
    if array(i) < 30.0
      array(i) = array(i) * inverse_scale_factor
    end if
  end do
```

## Coarrays
Intel Coarray tutorial: https://software.intel.com/content/www/us/en/develop/documentation/fortran-compiler-coarray-tutorial/top/modifying-the-program-to-use-coarrays.html

Coarrays are a feature introduced to the Fortran language in the 2008
standard to provide language-level parallelization for array operations
in a Single Program, Multiple Data (SPMD) programming paradigm.
The Fortran standard leaves the method of parallelization up to the
compiler, and the Intel® Fortran compiler uses MPI.

Coarrays are used to split an array operation across multiple copies
of the program. The copies are called "images". Each image has its
own local variables, plus a portion of any coarrays as shared
variables. A coarray can be thought of as having extra dimensions,
referred to as "codimensions". A single image (typically the 1-th
index) controls the I/O and problem setup, and images can read
from memory in other images.

For operations on large arrays such as constructing a super-array
from many sub-arrays (as in the construction of a Jacobian matrix),
the coarray feature of Fortran 08 can parallelize the procedure
improving overall computational efficiency.

.. TODO: Add example of coarray implementation in Fortran

## Data modeling and access rules
Fortran represents arrays in column-major order. This means that a
multidimensional array is represented in memory with column elements
being adjacent. If a given element in an array is at a location in
memory, one element before in memory corresponds to the element
above it in its column.

In order to make use of the single instruction, multiple data
features of modern processors, array construction and access
should happen in column-major order. That is, loops should loop
over the left-most index quickest. Slicing should occur with
the `:` also on the left-most index when possible.

With this in mind, data should be represented as structures of arrays
rather than arrays of structures. Concretely, this means that data
types within OpenFAST should contain the underlying arrays and arrays
should generally contain only numeric types.
Wikipedia page on AoS vs SoA: https://en.wikipedia.org/wiki/AoS_and_SoA

Here's a pretty good reference on array in C and Fortran (and derivates):
https://eli.thegreenplace.net/2015/memory-layout-of-multi-dimensional-arrays


The short program below displays the distance in memory in units
of bytes between elements of an array and neighboring elements.

```fortran

  program memloc

  implicit none

  integer(kind=8), dimension(3, 3) :: r, distance_up, distance_left

  ! Take the element values as their "ID"
  ! r(row, column)
  r(1,:) = (/ 1, 2, 3 /)
  r(2,:) = (/ 4, 5, 6 /)
  r(3,:) = (/ 7, 8, 9 /)
  print *, "Reference array:"
  call pretty_print_array(r)

  ! Compute the distance between matrix elements. Inputs to the `calculate_distance` function
  ! are indices for elements in the equation loc(this_element) - loc(other_element)
  distance_up(1,:) = (/ calculate_distance( 1,1 , 1,1), calculate_distance( 1,2 , 1,2), calculate_distance( 1,3 , 1,3) /)
  distance_up(2,:) = (/ calculate_distance( 2,1 , 1,1), calculate_distance( 2,2 , 1,2), calculate_distance( 2,3 , 1,3) /)
  distance_up(3,:) = (/ calculate_distance( 3,1 , 2,1), calculate_distance( 3,2 , 2,2), calculate_distance( 3,3 , 2,3) /)
  print *, "Distance in memory (bytes) for between an element and the one above it (top row zeroed):"
  call pretty_print_array(distance_up)

  distance_left(1,:) = (/ calculate_distance( 1,1 , 1,1), calculate_distance( 1,2 , 1,1), calculate_distance( 1,3 , 1,2) /)
  distance_left(2,:) = (/ calculate_distance( 2,1 , 2,1), calculate_distance( 2,2 , 2,1), calculate_distance( 2,3 , 2,2) /)
  distance_left(3,:) = (/ calculate_distance( 3,1 , 3,1), calculate_distance( 3,2 , 3,1), calculate_distance( 3,3 , 3,2) /)
  print *, "Distance in memory (bytes) for between an element and the one to the its left (first column zeroed):"
  call pretty_print_array(distance_left)

  contains

  integer(8) function calculate_distance(c1, r1, c2, r2)

      integer, intent(in) :: c1, r1, c2, r2
      calculate_distance = loc(r(c1, r1)) - loc(r(c2, r2))

  end function

  subroutine pretty_print_array(array)

      integer(8), dimension(3,3), intent(in) :: array
      print *, "["
      print '(I4, I4, I4)', array(1,1), array(1,2), array(1,3)
      print '(I4, I4, I4)', array(2,1), array(2,2), array(2,3)
      print '(I4, I4, I4)', array(3,1), array(3,2), array(3,3)
      print *, "]"

  end subroutine

  end program
```
