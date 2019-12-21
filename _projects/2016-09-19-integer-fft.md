---
title: 'Signal processing - FFT'
subtitle: 'Prototype and integer algorithm'
date: 2016-09-18 00:00:00
featured_image: '/images/demo/demo-square.jpg'
---

![](/images/demo/demo-landscape.jpg)

## Demo content

This project involved filtering an accelerometer signal at a given bandpass
and analyzing the frequency domain to find a known input frequency. The
ultimate application was real time analysis for a microcontroller. As such,
the project had two major phases:

1. Python implementation of bandpass filter and fast fourier transform
2. C implementation of Python program with an integer algorithm for the FFT

This project came my way via Upwork and was my first successful contract
project. The Python code repo is here and the integer algorithm repo is
here.

The first step I took in the project was to chart the given data. I
wrote a Python function to read the csv files in the format they were
given. Using Matplotlib, I was able to quickly visualize the data as
given to see what I was working with.

I then implemented the fast fourier transform to get an idea of the frequency
domain of the signal and begin to understand how my results should look.
This was easily done using Numpy and the FFT package.

The next step was filtering, and this was more challenging. I ultimately
went with a Butterworth filter from Numpy, but realized after some
debugging that in order to have no phase delay I needed to use a
forward-backward filter rather than a one way filter. In my opinion,
this chart is the most interesting since its removed the noise and you
can really see when they turned on and off the signal.

Running the FFT on the filtered results ultimately provided the frequency
the client expected to find.

