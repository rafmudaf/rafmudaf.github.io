# Raf's website

This is the host repository for my personal website.
It is certainly nothing special, it's not even
meant to be super interesting to anyone other than me.
I think of it like a sort of public cloud drive. Every
now and then I'll put some things here that I might
want to access from somewhere else or share with
someone easily. I'm currently working on developing
my writing skills, so I'll add content here that is
less refined or well thoughout than I am typically
comfortable doing. Feel free to engage however
you'd like, but no complaining because this
isn't really for you its for me :)

## How to build

The site is built with the Jekyll framework which
uses Ruby. First, install all dependencies specified
in the Gemfile:

```bash
bundle install
```

Then, build the content with Jekyll via Bundler with
the following command. This creates a localhost server
where you can access the site, and it refreshes the build
when any content changes. Note that you'll still have to
refresh the page in a browser. Also, any changes to the
site configuration require restarting the server.

```bash
bundle exec jekyll serve
```

## Troubleshooting

After upgrading macOS, ruby seems to always break. The
error often looks something like this:

```bash
bundle install

...

Gem::Ext::BuildError: ERROR: Failed to build gem native extension.

    current directory: /Users/rmudafor/Development/rafmudaf.github.io/vendor/bundle/ruby/2.6.0/gems/eventmachine-1.2.7/ext
/System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/bin/ruby -I /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0 -r ./siteconf20230112-50527-1a7lbq6.rb extconf.rb
checking for -lcrypto... *** extconf.rb failed ***
```

This might be due to Ruby headers being relocated or removed.
One possible fix is to upgrade Xcode command line tools. To force this,
detele the existing installation and reinstall.

```bash
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --install
```
