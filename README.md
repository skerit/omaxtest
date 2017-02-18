# Omaxtest

This repository is a raspberry-pi nodejs proof-of-concept of these 2 things:

* decoding an h.264 video using hardware-acceleration (`openmax` module)
* displaying that video using the GPU-backedn OpenVG library (`openvg` & `openvg-canvas` module)

For now, the decoded video contents are dumped on-screen, which segfaults after 2 seconds, but it's a start.

By the way: no X11 is required, this draws straight to the screen.

## Requirements

You will need to install these things:

```
sudo apt-get install libfreetype6 libfreetype6-dev libfreeimage3 libfreeimage-dev libraw10 fonts-dejavu
```

`openvg-canvas` will always look for fonts in the following directory:

```
/usr/share/fonts/truetype/ttf-dejavu/
```

Depending on your distribution, it could be in `truetype/dejavu` instead.
Just create a symlink like so:

```
cd /usr/share/fonts/truetype/
sudo ln -s dejavu/ ttf-dejavu
```

## Executing it

Just run the `index.js` file on your raspberry pi:

```
node index.js
```