---
title: 'Signal processing - FFT'
subtitle: 'Python FFT and C integer algorithm'
date: 2016-09-18 00:00:00
featured_image: '/images/demo/demo-square.jpg'
---

![](/images/demo/demo-landscape.jpg)

## Signal processing and integer algorithm FFT

This project involved filtering an accelerometer signal at a given bandpass
and analyzing the frequency domain to find a known input frequency. The
ultimate application was real time analysis for a microcontroller. As such,
the project had two major phases:

1. Python implementation of bandpass filter and fast fourier transform
2. C implementation of Python program with an integer algorithm for the FFT

This project came to me via Upwork and was my first successful contract
project. The Python code repo is [here](https://github.com/rafmudaf/filtersignal)
and the integer algorithm repo is [here](https://github.com/rafmudaf/integerFFT).

### Python implementation

The first step I took was to chart the given data. I wrote a Python function
to read the csv files in the format they were given. Using Matplotlib, I was
able to quickly visualize the data as given to see what I was working with.

Then I filtered the data based on the given basdpass range. I ultimately
went with a Butterworth filter from Numpy, but realized after some
debugging that in order to have no phase delay I needed to use a
forward-backward filter rather than a one way filter.

The first chart below is the raw input signal followed by the filtered
signal.

<img src="/images/posts/fft/input.png" width="400" />

<img src="/images/posts/fft/bandpass.png" width="400" />

I then implemented the fast fourier transform on the raw signal to get
an idea of the frequency domain and begin to understand how my results
should look. This was easily done using Numpy and the FFT package.

Finally, running the FFT on the filtered results ultimately provided
the frequency the client expected to find.

<img src="/images/posts/fft/inputfft.png" width="400" />

<img src="/images/posts/fft/bandpassfft.png" width="400" />

### Integer algorithm in C

The results using the integer algorithm in C are similar, but the
development process was very different. To begin with, I didn't
*really* know what an "integer algorithm" meant prior to accepting
the job, so understanding the nuances of integer-only math was
a learning curve. Furthermore, working with a C-library is not
as friendly as working with a Python library. Immediately, I
got stuck on using the library with the correct sampling frequency
to stay above the Nyquist frequency.

It was quite the experience and I learned a ton from it.
